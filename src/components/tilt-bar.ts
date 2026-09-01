import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant } from 'custom-card-helpers';

import { axisDisplayValue, axisFraction } from '../lib/axes';
import { formatPercent } from '../lib/formatters';
import { t } from '../lib/i18n';
import { PendingMoves, isPendingVisible } from '../lib/pending-move';
import type { RailAxis } from '../lib/rail-gestures';
import './rail-track';

/**
 * Reusable single-axis track row — generalizes the original venetian tilt
 * (slat-angle) row into any secondary cover axis.
 *
 * Shared between the cover-bar (stacked under each Position bar) and the tile
 * card (compact mini bar). It is purely presentational: it wraps the shared
 * `acp-rail-track` in a label + percentage row and fires an `acp-tilt-set`
 * CustomEvent (`detail: number` in [min,max]) when the gesture commits. The
 * host wires that to `setAxes()` so service routing stays in one place.
 *
 * The container, its gestures and its ARIA belong to `acp-rail-track` (#271
 * Part 2); this bar stays the source of truth for every value drawn on it and
 * hands the answers down as properties. Dragging paints a live preview (fill +
 * percentage) client-side and dispatches nothing: the rail reports the live
 * value back through `acp-rail-preview`, this bar re-renders its own readout
 * from it, and the commit arrives as `acp-rail-set` — which for this rail rides
 * the trailing compatibility `click` a real browser fires at the release point,
 * so a plain tap behaves exactly as a drag does. The track is a WAI-ARIA
 * slider: arrows step by 1 axis unit, Page keys by 10, Home/End jump to the
 * range ends.
 *
 * `acp-tilt-set` stays the ONLY event that leaves this element. The rail's own
 * `acp-rail-set` / `acp-rail-preview` bubble and compose, so both are stopped
 * here: letting them out would widen a public contract four hosts depend on,
 * and any host listening for rail events above one of its own rails would then
 * also hear every axis bar nested under it.
 *
 * `label`/`min`/`max`/`unit` default to the original tilt values (Tilt title,
 * 0–100, %), so an un-parameterized `acp-tilt-bar` renders exactly as before.
 * Fill/marker geometry and click math derive from `min`/`max`, not literal
 * 0/100, so a non-0–100 axis maps correctly.
 *
 * `layout="cover"` mirrors the cover-bar's `.cover` grid exactly so the axis
 * track and its percentage line up with the Position row above it.
 * `layout="tile"` is a compact inline row for the dense tile card.
 */
@customElement('acp-axis-bar')
export class AxisBar extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  /** Live axis value from the cover's per-axis state attribute. */
  @property({ attribute: false }) public actual: number | null = null;
  /** Solar target from the axis's target sensor. */
  @property({ attribute: false }) public target: number | null = null;
  /** Cover colour, matching the position bar / compass wedge. */
  @property({ attribute: false }) public coverColor: string | null = null;
  /** Compact sizing (cover-bar compact mode). */
  @property({ type: Boolean, reflect: true }) public compact = false;
  /** Non-interactive when true (e.g. the underlying cover is unavailable):
   *  the track ignores clicks and does not dispatch `acp-tilt-set`. */
  @property({ type: Boolean, reflect: true }) public disabled = false;
  /** Grid variant: align under the cover-bar position row, or inline tile row. */
  @property({ reflect: true }) public layout: 'cover' | 'tile' = 'cover';
  /** Display label. When null, falls back to the tilt title (original behavior). */
  @property({ attribute: false }) public label: string | null = null;
  /** Axis range lower bound (defaults to the original 0). */
  @property({ type: Number }) public min = 0;
  /** Axis range upper bound (defaults to the original 100). */
  @property({ type: Number }) public max = 100;
  /** Axis unit (defaults to the original '%'). Forward-looking; not yet
   *  rendered in the compact label. */
  @property() public unit = '%';
  /* The two tooltips take i18n KEYS rather than resolved strings (unlike
     `label`, which may come from a discovery-supplied axis name with no key at
     all): the marker tooltip interpolates `{pct}`, so the bar has to own the
     `t()` call. Both default to the tilt strings, the same way `label`/`min`/
     `max`/`unit` do — an un-parameterized bar is unchanged, while a position
     axis that forgets to pass them would otherwise tell the user to "set tilt". */
  /** i18n key for the track tooltip. Null → the tilt hint. */
  @property({ attribute: false }) public hintKey: string | null = null;
  /** i18n key for the target-marker tooltip; receives `{pct}`. Null → the tilt
   *  target hint. */
  @property({ attribute: false }) public targetHintKey: string | null = null;

  /** The live value under the finger, mirrored out of `acp-rail-track` by its
   *  `acp-rail-preview` event. The rail owns the gesture; this bar owns what
   *  the gesture is allowed to redraw — the fill, the percentage readout, and
   *  the suppression of the pending band underneath it. */
  @state() private _drag: number | null = null;

  /** Where the HOST knows this axis is heading when the move did not come from
   *  this bar — an automatic pipeline move. The bar cannot derive it: it sees
   *  only `actual`/`target` and has no entity to ask whether the cover is in
   *  motion, so the surface that owns the cover passes it down. */
  @property({ attribute: false }) public movingTo: number | null = null;

  /** Moves this bar itself commanded, until the axis reports arrival. */
  private _pending = new PendingMoves(this);
  private static readonly PENDING_KEY = 'axis';

  protected override updated(changed: PropertyValues): void {
    if (changed.has('actual')) this._pending.settle(() => this.actual);
  }

  /** True when driving this axis toward its maximum blocks MORE sun, so the
   *  track fills toward the maximum. False mirrors it, which is the slat-angle
   *  case: closing the slats blocks the sun but lowers the value.
   *
   *  Defaults to the identity so a caller that does not thread the axis flag
   *  keeps the geometry it had before this existed. Cover surfaces pass the
   *  resolved `ResolvedAxis.openBlocksSun`; group surfaces have no per-member
   *  discovery, so they pass the group's own position-axis polarity for a
   *  position track and a literal `false` for a slat track — the value the
   *  integration gives every tilt axis. See `lib/axes.ts → axisDisplayValue`. */
  @property({ type: Boolean }) public openBlocksSun = true;

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    // A drag in flight overrides server truth for this bar's fill and readout;
    // once it ends, `actual` takes over again with no extra bookkeeping.
    const drag = this._drag;
    const dragging = drag !== null;
    const shownValue = drag ?? this.actual;
    // `axisFraction` normalizes min/max onto the track and applies the same
    // mirroring rule `axisDisplayValue` does — this bar's own `_frac` was that
    // rule written a second time. The element's `min`/`max`/`openBlocksSun`
    // properties satisfy the helper's axis shape structurally.
    const actualFrac = axisFraction(shownValue, this);
    const targetFrac = axisFraction(this.target, this);
    // Hidden while a drag is in flight: the drag preview already paints where
    // the finger is, and a band to the PREVIOUS command underneath it would be
    // two answers to the same question.
    // An explicit command from this bar wins over the host's automatic-move
    // hint: if both are live the user's own value is the one they are waiting on.
    const commanded = dragging ? null : (this._pending.get(AxisBar.PENDING_KEY) ?? this.movingTo);
    // Drop a destination the axis is ALREADY at. Commanding a value within
    // arrival tolerance of the current one moves nothing, so `actual` never
    // changes and nothing ever settles the move — the indicator would sit there
    // as a zero-width band and a stray pip until the timeout.
    const pending = isPendingVisible(shownValue, commanded) ? commanded : null;
    const pendingFrac = pending === null ? null : axisFraction(pending, this);
    const label = this.label ?? t('covers.tilt_title', this.hass);
    return html`
      <div
        class="row ${this.layout}"
        style=${this.coverColor ? `--acp-cover-color:${this.coverColor}` : nothing}
      >
        <span class="label">${label}</span>
        <span class="num">${formatPercent(shownValue)}</span>
        <acp-rail-track
          variant="dialog"
          .hass=${this.hass}
          .axis=${this._axis()}
          .value=${this.actual}
          .fillPct=${actualFrac}
          .closedPct=${100 - actualFrac}
          .target=${this.target}
          .targetPct=${targetFrac}
          .pending=${pending}
          .pendingPct=${pendingFrac}
          .valueNow=${shownValue === null ? this.min : axisDisplayValue(shownValue, this)}
          .valueText=${formatPercent(shownValue)}
          .label=${label}
          .hint=${t(this.hintKey ?? 'covers.tilt_click_to_set', this.hass)}
          .targetTooltip=${
            // The VALUE, not the drawn fraction — those diverge the moment the
            // axis is mirrored or its range is not 0..100.
            this.target === null
              ? null
              : t(this.targetHintKey ?? 'covers.tilt_target_tooltip', this.hass, {
                  pct: this.target,
                })
          }
          ?disabled=${this.disabled}
          @acp-rail-set=${this._onRailSet}
          @acp-rail-preview=${this._onRailPreview}
        ></acp-rail-track>
      </div>
    `;
  }

  /** The gesture/ARIA range, rebuilt each render rather than passing `this`:
   *  `min`/`max`/`openBlocksSun` are mutable reactive properties, and handing
   *  the rail a stable reference would leave `aria-valuemin`/`aria-valuemax`
   *  stale on the one update where only the range changed. */
  private _axis(): RailAxis {
    return { min: this.min, max: this.max, openBlocksSun: this.openBlocksSun };
  }

  private _commit(value: number): void {
    this._pending.start(AxisBar.PENDING_KEY, value);
    this.dispatchEvent(
      new CustomEvent<number>('acp-tilt-set', { detail: value, bubbles: true, composed: true }),
    );
  }

  /* The rail commits (click, drag release, or the WAI-ARIA key map stepping in
     axis units from `value`) and reports its live preview; both events stop
     here so `acp-tilt-set` stays this element's only public one. */
  private _onRailSet = (e: Event): void => {
    e.stopPropagation();
    this._commit((e as CustomEvent<number>).detail);
  };

  private _onRailPreview = (e: Event): void => {
    e.stopPropagation();
    this._drag = (e as CustomEvent<number | null>).detail;
  };

  public static styles = [
    css`
      :host {
        display: block;
      }
      .row {
        display: grid;
        align-items: center;
      }
      /* Cover-bar variant: mirror .cover's grid so the track + percentage line up
       with the Position row directly above (name | num | track | warn-spacer). */
      .row.cover {
        /* Must stay identical to acp-cover-bar's .cover grid — these are two
         separate grids stacked in one .cover-group, so any divergence offsets
         this track from the position track directly above it. Fixed, not
         minmax: an auto track resolves per-grid to its own content.

         The 22px column is the position row's go-to-target button. This row has
         no counterpart — the button drives the POSITION axis, and a tilt target
         is a separate value — so the column is present here purely as a spacer
         to keep the two tracks aligned. */
        grid-template-columns: minmax(80px, 1fr) 11ch 3fr 22px 16px;
        gap: 8px;
        font-size: 0.82rem;
      }
      :host([compact]) .row.cover {
        gap: 6px;
        font-size: 0.75rem;
      }
      /* Tile variant: inline "TILT 35% [track]" — label then % then the bar. */
      .row.tile {
        grid-template-columns: auto auto 1fr;
        gap: 6px;
        font-size: 0.75rem;
      }
      .label {
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--secondary-text-color);
      }
      .num {
        font-variant-numeric: tabular-nums;
        color: var(--secondary-text-color);
      }
      .row.cover .num {
        text-align: right;
      }
      /* The track itself — its box, its fill segments, its focus ring, its
       drag/disabled states — belongs to acp-rail-track now. What is left here
       is the one thing a host still decides: how tall the rail is. Both dense
       placements shrink it to 6px, and the rule that used to say so reached
       inside the element, so it goes through the knob instead. */
      :host([compact]) acp-rail-track,
      .row.tile acp-rail-track {
        --acp-rail-height: 6px;
      }
    `,
  ];
}

/**
 * Back-compat alias. The original tag was `acp-tilt-bar`; keep it registered
 * (as a no-op subclass) so existing hosts/tests that reference the tag continue
 * to resolve to the generalized element.
 */
if (!customElements.get('acp-tilt-bar')) {
  customElements.define('acp-tilt-bar', class extends AxisBar {});
}
