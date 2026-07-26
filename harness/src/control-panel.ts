import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { COVER_DEVICE_CLASS_ICONS, HANDLER_ORDER, type HandlerName } from '../../src/const';
import { SCENARIOS, scenarioIssue, type Scenario } from './scenarios';

/** Per-cover device_class selector options: the card's known HA classes plus
 *  `none` (emit NO device_class, exercising the cover_type fallback chain). */
const COVER_DEVICE_CLASS_OPTIONS: string[] = [...Object.keys(COVER_DEVICE_CLASS_ICONS), 'none'];
import type {
  ClimateInactiveReason,
  ClimateStrategy,
  CoverType,
  GroupFields,
  HarnessConfig,
  HarnessEntry,
  ManagedCoverCfg,
  MotionStatusValue,
  TooltipMode,
} from './types';

/** Default Cover Group state for the "Group entry" control-panel toggle. */
function defaultGroupFields(): GroupFields {
  return {
    member_positions: {
      'cover.living_left': 40,
      'cover.living_right': 60,
      'cover.hall_generic': 0,
    },
    member_winners: {
      'cover.living_left': 'solar',
      'cover.living_right': 'manual',
    },
    aggregate_position: 33,
    state: 'mixed',
    active_scene: 'none',
    scene_option: 'auto',
    locked: false,
    automation: true,
    climate_mode: 'summer_mode',
  };
}

/**
 * Dispatched whenever any control changes. Always carries the full config.
 */
export interface ConfigChangeDetail {
  config: HarnessConfig;
}

@customElement('acp-harness-control-panel')
export class AcpHarnessControlPanel extends LitElement {
  @property({ attribute: false }) config!: HarnessConfig;

  // Preset ordering in the picker. 'name' (A–Z) is the default; 'added' sorts by
  // the scenario's `added` date (undated ones keep their definition/append order,
  // ahead of dated ones).
  @state() private _scenarioSort: 'name' | 'added' = 'name';

  // Preset issue filter. 'all' shows every scenario; a number limits the picker
  // to scenarios whose effective issue (explicit `issue` field or `#NNN` parsed
  // from the label) matches.
  @state() private _issueFilter: number | 'all' = 'all';

  @state() private _openSections: Record<string, boolean> = {
    scenario: true,
    location: true,
    time: true,
    entries: true,
    overrides: true,
    decision: false,
    customPositions: false,
    cards: false,
  };

  protected render(): TemplateResult {
    return html`
      ${this._section('scenario', 'Scenario & theme', this._renderScenario())}
      ${this._section('location', 'Location', this._renderLocation())}
      ${this._section('time', 'Time of day', this._renderTime())}
      ${this._section('entries', `Entries (${this.config.entries.length})`, this._renderEntries())}
      ${this._section('overrides', 'Override state', this._renderOverrides())}
      ${this._section('decision', 'Decision trace', this._renderDecision())}
      ${this._section('customPositions', 'Custom position slots', this._renderSlots())}
      ${this._section('cards', 'Per-card config', this._renderCardOptions())}
    `;
  }

  private _section(id: string, title: string, body: TemplateResult): TemplateResult {
    const open = this._openSections[id];
    return html`
      <section class=${open ? 'open' : ''}>
        <header @click=${() => this._toggleSection(id)}>
          <span class="chev">${open ? '▾' : '▸'}</span>
          <span class="title">${title}</span>
        </header>
        ${open ? html`<div class="body">${body}</div>` : ''}
      </section>
    `;
  }

  private _toggleSection(id: string): void {
    this._openSections = { ...this._openSections, [id]: !this._openSections[id] };
  }

  private _emit(next: HarnessConfig): void {
    this.dispatchEvent(
      new CustomEvent<ConfigChangeDetail>('config-change', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _renderScenario(): TemplateResult {
    const sorted = this._sortedScenarios();
    return html`
      <label class="row">
        <span>Preset</span>
        <div class="scenario-picker">
          <button
            class="step-btn"
            title="Previous scenario"
            aria-label="Previous scenario"
            @click=${() => this._stepScenario(-1)}
          >
            −
          </button>
          <select .value=${this.config.scenario} @change=${this._onScenarioChange}>
            ${sorted.map(
              (s) =>
                html`<option value=${s.id} ?selected=${s.id === this.config.scenario}>
                  ${s.label}
                </option>`,
            )}
          </select>
          <button
            class="step-btn"
            title="Next scenario"
            aria-label="Next scenario"
            @click=${() => this._stepScenario(1)}
          >
            +
          </button>
        </div>
      </label>
      <label class="row">
        <span>Sort presets</span>
        <select
          .value=${this._scenarioSort}
          @change=${(e: Event) =>
            (this._scenarioSort = (e.target as HTMLSelectElement)
              .value as typeof this._scenarioSort)}
        >
          <option value="name" ?selected=${this._scenarioSort === 'name'}>Name (A–Z)</option>
          <option value="added" ?selected=${this._scenarioSort === 'added'}>Date added</option>
        </select>
      </label>
      <label class="row">
        <span>Filter by issue</span>
        <select
          @change=${(e: Event) => {
            const v = (e.target as HTMLSelectElement).value;
            this._issueFilter = v === 'all' ? 'all' : parseInt(v, 10);
          }}
        >
          <option value="all" ?selected=${this._issueFilter === 'all'}>All issues</option>
          ${this._scenarioIssues().map(
            (n) => html`<option value=${n} ?selected=${this._issueFilter === n}>#${n}</option>`,
          )}
        </select>
      </label>
      <p class="hint">${SCENARIOS.find((s) => s.id === this.config.scenario)?.description ?? ''}</p>
      <label class="row">
        <span>Theme</span>
        <select
          @change=${(e: Event) =>
            this._emit({
              ...this.config,
              theme: (e.target as HTMLSelectElement).value as 'light' | 'dark',
            })}
        >
          <option value="light" ?selected=${this.config.theme === 'light'}>Light</option>
          <option value="dark" ?selected=${this.config.theme === 'dark'}>Dark</option>
        </select>
      </label>
      <label class="row">
        <span>Language</span>
        <select
          @change=${(e: Event) =>
            this._emit({
              ...this.config,
              language: (e.target as HTMLSelectElement).value as 'en' | 'fr' | 'de',
            })}
        >
          <option value="en" ?selected=${this.config.language === 'en'}>English</option>
          <option value="fr" ?selected=${this.config.language === 'fr'}>Français</option>
          <option value="de" ?selected=${this.config.language === 'de'}>Deutsch</option>
        </select>
      </label>
      ${this._checkbox(
        'Legacy integration (no discovery / set_axes)',
        this.config.legacyIntegration,
        (v) => this._emit({ ...this.config, legacyIntegration: v }),
      )}
      <label class="row">
        <span>Tooltips</span>
        <select
          @change=${(e: Event) =>
            this._emit({
              ...this.config,
              tooltips: {
                ...this.config.tooltips,
                mode: (e.target as HTMLSelectElement).value as TooltipMode,
              },
            })}
        >
          <option value="floating" ?selected=${this.config.tooltips.mode === 'floating'}>
            Floating (card-owned)
          </option>
          <option value="native" ?selected=${this.config.tooltips.mode === 'native'}>
            Native (browser title)
          </option>
        </select>
      </label>
      ${this.config.tooltips.mode === 'floating'
        ? html`
            ${this._numberSlider(
              'Tooltip offset → right',
              this.config.tooltips.offset[0],
              0,
              48,
              1,
              (v) =>
                this._emit({
                  ...this.config,
                  tooltips: {
                    ...this.config.tooltips,
                    offset: [v, this.config.tooltips.offset[1]],
                  },
                }),
            )}
            ${this._numberSlider(
              'Tooltip offset ↓ down',
              this.config.tooltips.offset[1],
              0,
              48,
              1,
              (v) =>
                this._emit({
                  ...this.config,
                  tooltips: {
                    ...this.config.tooltips,
                    offset: [this.config.tooltips.offset[0], v],
                  },
                }),
            )}
          `
        : ''}
      <button class="ghost" @click=${this._onReset}>Reset to preset</button>
    `;
  }

  private _onScenarioChange = (e: Event): void => {
    const id = (e.target as HTMLSelectElement).value;
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    this._emit({ ...s.build(), theme: this.config.theme, language: this.config.language });
  };

  // Distinct issue numbers across all scenarios (explicit field or parsed from
  // the label), ascending — populates the "Filter by issue" dropdown.
  private _scenarioIssues(): number[] {
    const set = new Set<number>();
    for (const s of SCENARIOS) {
      const n = scenarioIssue(s);
      if (n != null) set.add(n);
    }
    return [...set].sort((a, b) => a - b);
  }

  // Presets after applying the issue filter, in the selected sort order. 'added'
  // sorts by the `added` date; undated scenarios have no date so they keep their
  // definition (append) order and sort ahead of dated ones. 'name' is A–Z.
  private _sortedScenarios(): Scenario[] {
    const idx = new Map(SCENARIOS.map((s, i) => [s, i] as const));
    let list = [...SCENARIOS];
    if (this._issueFilter !== 'all') {
      list = list.filter((s) => scenarioIssue(s) === this._issueFilter);
    }
    if (this._scenarioSort === 'name') {
      return list.sort((a, b) => a.label.localeCompare(b.label));
    }
    return list.sort((a, b) => {
      const da = a.added ? Date.parse(a.added) : null;
      const db = b.added ? Date.parse(b.added) : null;
      if (da == null && db == null) return idx.get(a)! - idx.get(b)!;
      if (da == null) return -1; // undated = older → first
      if (db == null) return 1;
      return da - db || idx.get(a)! - idx.get(b)!;
    });
  }

  // Step to the previous (-1) / next (+1) scenario in the current sort order,
  // wrapping at both ends, so the − / + buttons cycle presets without opening the
  // dropdown.
  private _stepScenario = (delta: number): void => {
    const sorted = this._sortedScenarios();
    const idx = sorted.findIndex((x) => x.id === this.config.scenario);
    const next = sorted[(idx + delta + sorted.length) % sorted.length];
    if (!next) return;
    this._emit({ ...next.build(), theme: this.config.theme, language: this.config.language });
  };

  private _onReset = (): void => {
    const s = SCENARIOS.find((x) => x.id === this.config.scenario);
    if (!s) return;
    this._emit({ ...s.build(), theme: this.config.theme, language: this.config.language });
  };

  private _renderLocation(): TemplateResult {
    return html`
      <label class="row">
        <span>Latitude</span>
        <input
          type="number"
          step="0.0001"
          min="-90"
          max="90"
          .value=${String(this.config.latitude)}
          @change=${(e: Event) =>
            this._emit({
              ...this.config,
              latitude: parseFloat((e.target as HTMLInputElement).value) || 0,
            })}
        />
      </label>
      <label class="row">
        <span>Longitude</span>
        <input
          type="number"
          step="0.0001"
          min="-180"
          max="180"
          .value=${String(this.config.longitude)}
          @change=${(e: Event) =>
            this._emit({
              ...this.config,
              longitude: parseFloat((e.target as HTMLInputElement).value) || 0,
            })}
        />
      </label>
      <div class="presets">
        ${[
          { label: 'Seattle', lat: 47.6, lon: -122.3 },
          { label: 'NYC', lat: 40.7, lon: -74 },
          { label: 'London', lat: 51.5, lon: -0.1 },
          { label: 'Reykjavik', lat: 64.1, lon: -21.9 },
          { label: 'Equator', lat: 0, lon: 0 },
          { label: 'Sydney', lat: -33.9, lon: 151.2 },
        ].map(
          (p) => html`
            <button
              class="ghost"
              @click=${() => this._emit({ ...this.config, latitude: p.lat, longitude: p.lon })}
            >
              ${p.label}
            </button>
          `,
        )}
      </div>
    `;
  }

  private _renderTime(): TemplateResult {
    const min = this.config.timeOfDayMinutes;
    const hh = Math.floor(min / 60)
      .toString()
      .padStart(2, '0');
    const mm = (min % 60).toString().padStart(2, '0');
    return html`
      <label class="row">
        <span>Date</span>
        <input
          type="date"
          .value=${this.config.date}
          @change=${(e: Event) =>
            this._emit({ ...this.config, date: (e.target as HTMLInputElement).value })}
        />
      </label>
      <label class="row">
        <span>Time</span>
        <span class="time-display">${hh}:${mm}</span>
      </label>
      <input
        type="range"
        class="time-slider"
        min="0"
        max="1439"
        step="1"
        .value=${String(min)}
        @input=${(e: Event) =>
          this._emit({
            ...this.config,
            timeOfDayMinutes: parseInt((e.target as HTMLInputElement).value, 10),
          })}
      />
      <div class="row buttons">
        <button class="ghost" @click=${this._setNow}>Now</button>
        <button class="ghost" @click=${this._setNoon}>Noon</button>
        <button class="ghost" @click=${this._setSunrise}>06:00</button>
        <button class="ghost" @click=${this._setSunset}>18:00</button>
        <button
          class=${this.config.playing ? 'primary' : 'ghost'}
          @click=${() => this._emit({ ...this.config, playing: !this.config.playing })}
        >
          ${this.config.playing ? 'Pause ⏸' : 'Play ▶'}
        </button>
      </div>
    `;
  }

  private _setNow = (): void => {
    const d = new Date();
    this._emit({
      ...this.config,
      date: d.toISOString().slice(0, 10),
      timeOfDayMinutes: d.getHours() * 60 + d.getMinutes(),
    });
  };
  private _setNoon = (): void => this._emit({ ...this.config, timeOfDayMinutes: 720 });
  private _setSunrise = (): void => this._emit({ ...this.config, timeOfDayMinutes: 360 });
  private _setSunset = (): void => this._emit({ ...this.config, timeOfDayMinutes: 1080 });

  private _renderEntries(): TemplateResult {
    return html`
      <div class="entries-actions">
        <button class="ghost" ?disabled=${this.config.entries.length >= 4} @click=${this._addEntry}>
          + Add entry
        </button>
      </div>
      ${this.config.entries.map((e, idx) => this._renderEntry(e, idx))}
    `;
  }

  private _addEntry = (): void => {
    if (this.config.entries.length >= 4) return;
    const n = this.config.entries.length;
    const newId = `entry_${n + 1}`;
    const newEntry: HarnessEntry = {
      entry_id: newId,
      title: `Window ${n + 1}`,
      cover_type: 'cover_blind',
      window_azimuth: [180, 90, 270, 0][n] ?? 180,
      fov_left: 45,
      fov_right: 45,
      target_position: 50,
      covers: [
        { entity_id: `cover.${newId}_main`, friendly_name: `Window ${n + 1}`, position: 50 },
      ],
      color: ['#ff7043', '#7e57c2', '#42a5f5', '#26a69a'][n] ?? '#ff7043',
      slots: [
        {
          slot: 1,
          enabled: false,
          position: 75,
          name: 'Movie time',
          min_mode: false,
          priority: 60,
        },
        { slot: 2, enabled: false, position: 20, name: 'Privacy', min_mode: false, priority: 70 },
        {
          slot: 3,
          enabled: false,
          position: 100,
          name: 'Welcome home',
          min_mode: false,
          priority: 50,
        },
        { slot: 4, enabled: false, position: 50, name: 'Floor', min_mode: true, priority: 90 },
        {
          slot: 5,
          enabled: true,
          position: 0,
          name: 'Safety',
          min_mode: false,
          priority: 100,
          sensors: [`binary_sensor.${newId}_wind`, `binary_sensor.${newId}_frost`],
          template: true,
          template_mode: 'or',
        },
      ],
      flags: {
        integration_enabled: true,
        automatic_control: true,
        manual_override: false,
        manual_override_minutes_from_now: 60,
        held_position: null,
        linear_position: null,
        // Scenario-driven, matching the linear_position precedent — no
        // dedicated toggle (#234, #236).
        inverse_state: false,
        inverse_tilt: false,
        safety_slot_active: false,
        motion_status: 'idle',
        motion_timeout_minutes_from_now: 1,
        climate_strategy: 'intermediate',
        indoor_temp: 21,
        outdoor_temp: 18,
        // adaptive-cover-pro-card#168: state-gen now threads this flag into the
        // active-slug branch's inactive_reason (previously hardcoded 'active').
        // Keep the base default 'active' so the default panel stays
        // active-looking with the default 'intermediate' strategy; the
        // climate-not-winner scenario overrides this to demonstrate #168.
        climate_inactive_reason: 'active',
        climate_temp_low: 18,
        climate_temp_high: 25,
        climate_temp_summer_outside: 22,
        glare_active: false,
        is_sunset_active: false,
        in_time_window: true,
        schedule_start_minutes: 7 * 60 + 30,
        schedule_end_minutes: 21 * 60,
        default_position: 60,
        throttle_pending: false,
        throttle_skipped_minutes_ago: 2,
        throttle_threshold_minutes: 15,
      },
    };
    this._emit({ ...this.config, entries: [...this.config.entries, newEntry] });
  };

  private _removeEntry(idx: number): void {
    if (this.config.entries.length <= 1) return;
    const entries = this.config.entries.filter((_, i) => i !== idx);
    this._emit({ ...this.config, entries });
  }

  private _patchEntry(idx: number, patch: Partial<HarnessEntry>): void {
    const entries = this.config.entries.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    this._emit({ ...this.config, entries });
  }

  private _renderEntry(e: HarnessEntry, idx: number): TemplateResult {
    return html`
      <fieldset class="entry">
        <legend>
          <span class="dot" style=${`background:${e.color}`}></span>
          ${e.title}
          ${this.config.entries.length > 1
            ? html`<button class="ghost tiny" @click=${() => this._removeEntry(idx)}>×</button>`
            : ''}
        </legend>
        <label class="row">
          <span>Title</span>
          <input
            type="text"
            .value=${e.title}
            @change=${(ev: Event) =>
              this._patchEntry(idx, { title: (ev.target as HTMLInputElement).value })}
          />
        </label>
        ${this._checkbox('Group entry (Cover Group)', !!e.is_group, (v) =>
          this._patchEntry(
            idx,
            v ? { is_group: true, group: e.group ?? defaultGroupFields() } : { is_group: false },
          ),
        )}
        <label class="row">
          <span>Cover type</span>
          <select
            @change=${(ev: Event) =>
              this._patchEntry(idx, {
                cover_type: (ev.target as HTMLSelectElement).value as CoverType,
              })}
          >
            ${(['cover_blind', 'cover_awning', 'cover_tilt', 'cover_venetian'] as CoverType[]).map(
              (c) =>
                html`<option value=${c} ?selected=${e.cover_type === c}>${c.slice(6)}</option>`,
            )}
          </select>
        </label>
        <label class="row">
          <span>Color</span>
          <input
            type="color"
            .value=${e.color}
            @change=${(ev: Event) =>
              this._patchEntry(idx, { color: (ev.target as HTMLInputElement).value })}
          />
        </label>
        ${this._numberSlider('Window azimuth', e.window_azimuth, 0, 360, 1, (v) =>
          this._patchEntry(idx, { window_azimuth: v }),
        )}
        ${this._numberSlider('SAA left', e.fov_left, 0, 90, 1, (v) =>
          this._patchEntry(idx, { fov_left: v }),
        )}
        ${this._numberSlider('SAA right', e.fov_right, 0, 90, 1, (v) =>
          this._patchEntry(idx, { fov_right: v }),
        )}
        ${this._optionalNumber('Min elevation', e.min_elevation, -10, 90, (v) =>
          this._patchEntry(idx, { min_elevation: v }),
        )}
        ${this._optionalNumber('Max elevation', e.max_elevation, -10, 90, (v) =>
          this._patchEntry(idx, { max_elevation: v }),
        )}
        ${this._renderBlindSpot(e, idx)}
        ${this._numberSlider('Target position %', e.target_position, 0, 100, 1, (v) =>
          this._patchEntry(idx, {
            target_position: v,
            covers: e.covers.map((c) => ({ ...c, position: v })),
          }),
        )}
        ${e.cover_type === 'cover_venetian'
          ? this._numberSlider('Target tilt %', e.target_tilt ?? 50, 0, 100, 1, (v) =>
              this._patchEntry(idx, {
                target_tilt: v,
                covers: e.covers.map((c) => ({ ...c, tilt: v })),
              }),
            )
          : ''}
        ${this._renderCovers(e, idx)}
      </fieldset>
    `;
  }

  private _renderBlindSpot(e: HarnessEntry, idx: number): TemplateResult {
    const enabled = !!e.blind_spot_range;
    return html`
      <label class="row">
        <span>Blind spot</span>
        <input
          type="checkbox"
          .checked=${enabled}
          @change=${(ev: Event) => {
            const on = (ev.target as HTMLInputElement).checked;
            this._patchEntry(idx, { blind_spot_range: on ? [10, 10] : undefined });
          }}
        />
      </label>
      ${enabled
        ? html`
            ${this._numberSlider('Blind spot left', e.blind_spot_range![0], 0, 90, 1, (v) =>
              this._patchEntry(idx, { blind_spot_range: [v, e.blind_spot_range![1]] }),
            )}
            ${this._numberSlider('Blind spot right', e.blind_spot_range![1], 0, 90, 1, (v) =>
              this._patchEntry(idx, { blind_spot_range: [e.blind_spot_range![0], v] }),
            )}
          `
        : ''}
    `;
  }

  private _renderCovers(e: HarnessEntry, idx: number): TemplateResult {
    return html`
      <div class="covers">
        <div class="covers-head">
          <span>Managed covers</span>
          <button
            class="ghost tiny"
            @click=${() => {
              const n = e.covers.length + 1;
              const next: ManagedCoverCfg = {
                entity_id: `cover.${e.entry_id}_${n}`,
                friendly_name: `${e.title} ${n}`,
                position: e.target_position,
                tilt: e.target_tilt ?? 50,
              };
              this._patchEntry(idx, { covers: [...e.covers, next] });
            }}
          >
            + Cover
          </button>
        </div>
        ${e.covers.map(
          (c, ci) => html`
            <div class="cover-row">
              <input
                type="text"
                .value=${c.entity_id}
                @change=${(ev: Event) => {
                  const covers = e.covers.map((cc, i) =>
                    i === ci ? { ...cc, entity_id: (ev.target as HTMLInputElement).value } : cc,
                  );
                  this._patchEntry(idx, { covers });
                }}
              />
              <input
                type="number"
                min="0"
                max="100"
                title="Position %"
                .value=${String(c.position ?? '')}
                @change=${(ev: Event) => {
                  const v = (ev.target as HTMLInputElement).value;
                  const covers = e.covers.map((cc, i) =>
                    i === ci ? { ...cc, position: v === '' ? null : parseInt(v, 10) } : cc,
                  );
                  this._patchEntry(idx, { covers });
                }}
              />
              <select
                title="device_class (icon + control glyphs)"
                @change=${(ev: Event) => {
                  const v = (ev.target as HTMLSelectElement).value;
                  const covers = e.covers.map((cc, i) =>
                    i === ci ? { ...cc, device_class: v === '' ? undefined : v } : cc,
                  );
                  this._patchEntry(idx, { covers });
                }}
              >
                <option value="" ?selected=${c.device_class === undefined}>dc: default</option>
                ${COVER_DEVICE_CLASS_OPTIONS.map(
                  (dc) =>
                    html`<option value=${dc} ?selected=${c.device_class === dc}>${dc}</option>`,
                )}
              </select>
              ${e.cover_type === 'cover_venetian'
                ? html`<input
                    type="number"
                    min="0"
                    max="100"
                    title="Tilt %"
                    .value=${String(c.tilt ?? '')}
                    @change=${(ev: Event) => {
                      const v = (ev.target as HTMLInputElement).value;
                      const covers = e.covers.map((cc, i) =>
                        i === ci ? { ...cc, tilt: v === '' ? null : parseInt(v, 10) } : cc,
                      );
                      this._patchEntry(idx, { covers });
                    }}
                  />`
                : ''}
              ${e.covers.length > 1
                ? html`<button
                    class="ghost tiny"
                    @click=${() => {
                      const covers = e.covers.filter((_, i) => i !== ci);
                      this._patchEntry(idx, { covers });
                    }}
                  >
                    ×
                  </button>`
                : ''}
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderOverrides(): TemplateResult {
    return html`
      ${this.config.entries.map(
        (e, idx) => html`
          <fieldset class="entry">
            <legend>${e.title}</legend>
            ${this._checkbox('Integration enabled', e.flags.integration_enabled, (v) =>
              this._patchFlags(idx, { integration_enabled: v }),
            )}
            ${this._checkbox('Automatic control', e.flags.automatic_control, (v) =>
              this._patchFlags(idx, { automatic_control: v }),
            )}
            ${this._checkbox('Manual override', e.flags.manual_override, (v) =>
              this._patchFlags(idx, { manual_override: v }),
            )}
            ${e.flags.manual_override
              ? this._numberSlider(
                  'Override ends in (min)',
                  e.flags.manual_override_minutes_from_now,
                  0,
                  240,
                  1,
                  (v) => this._patchFlags(idx, { manual_override_minutes_from_now: v }),
                )
              : ''}
            ${this._checkbox('Safety slot 5 (priority 100)', e.flags.safety_slot_active, (v) =>
              this._patchFlags(idx, { safety_slot_active: v }),
            )}
            <label class="row">
              <span>Transit (no-feedback)</span>
              <select
                @change=${(ev: Event) => {
                  const v = (ev.target as HTMLSelectElement).value;
                  this._patchFlags(idx, {
                    transit_direction: v === 'none' ? null : (v as 'opening' | 'closing'),
                  });
                }}
              >
                ${(['none', 'opening', 'closing'] as const).map(
                  (v) =>
                    html`<option
                      value=${v}
                      ?selected=${(e.flags.transit_direction ?? 'none') === v}
                    >
                      ${v}
                    </option>`,
                )}
              </select>
            </label>
            <label class="row">
              <span>Occupancy status</span>
              <select
                @change=${(ev: Event) =>
                  this._patchFlags(idx, {
                    motion_status: (ev.target as HTMLSelectElement).value as MotionStatusValue,
                  })}
              >
                ${(['idle', 'motion_detected', 'timeout_pending'] as MotionStatusValue[]).map(
                  (v) =>
                    html`<option value=${v} ?selected=${e.flags.motion_status === v}>${v}</option>`,
                )}
              </select>
            </label>
            <label class="row">
              <span>Climate</span>
              <select
                @change=${(ev: Event) =>
                  this._patchFlags(idx, {
                    climate_strategy: (ev.target as HTMLSelectElement).value as ClimateStrategy,
                  })}
              >
                ${(
                  ['summer_mode', 'winter_mode', 'intermediate', 'unknown'] as ClimateStrategy[]
                ).map(
                  (v) =>
                    html`<option value=${v} ?selected=${e.flags.climate_strategy === v}>
                      ${v}
                    </option>`,
                )}
              </select>
            </label>
            <label class="row">
              <span>Inactive reason</span>
              <select
                @change=${(ev: Event) =>
                  this._patchFlags(idx, {
                    climate_inactive_reason: (ev.target as HTMLSelectElement)
                      .value as ClimateInactiveReason,
                  })}
              >
                ${(
                  [
                    'outside_time_window',
                    'thresholds_not_met',
                    'other_mode_active',
                    'readings_unavailable',
                    'mode_off',
                    'active',
                  ] as ClimateInactiveReason[]
                ).map(
                  (v) =>
                    html`<option value=${v} ?selected=${e.flags.climate_inactive_reason === v}>
                      ${v}
                    </option>`,
                )}
              </select>
            </label>
            ${this._numberSlider('Indoor °C', e.flags.indoor_temp, -10, 40, 1, (v) =>
              this._patchFlags(idx, { indoor_temp: v }),
            )}
            ${this._numberSlider('Outdoor °C', e.flags.outdoor_temp, -20, 45, 1, (v) =>
              this._patchFlags(idx, { outdoor_temp: v }),
            )}
            ${this._numberSlider(
              'Threshold low °C',
              e.flags.climate_temp_low ?? 18,
              -10,
              40,
              1,
              (v) => this._patchFlags(idx, { climate_temp_low: v }),
            )}
            ${this._numberSlider(
              'Threshold high °C',
              e.flags.climate_temp_high ?? 25,
              -10,
              40,
              1,
              (v) => this._patchFlags(idx, { climate_temp_high: v }),
            )}
            ${this._numberSlider(
              'Threshold summer °C',
              e.flags.climate_temp_summer_outside ?? 22,
              -10,
              45,
              1,
              (v) => this._patchFlags(idx, { climate_temp_summer_outside: v }),
            )}
            ${this._checkbox('Glare active', e.flags.glare_active, (v) =>
              this._patchFlags(idx, { glare_active: v }),
            )}
            ${this._checkbox('In schedule window', e.flags.in_time_window, (v) =>
              this._patchFlags(idx, { in_time_window: v }),
            )}
            ${this._scheduleBound('Schedule start', e.flags.schedule_start_minutes, (v) =>
              this._patchFlags(idx, { schedule_start_minutes: v }),
            )}
            ${this._scheduleBound('Schedule end', e.flags.schedule_end_minutes, (v) =>
              this._patchFlags(idx, { schedule_end_minutes: v }),
            )}
            ${this._numberSlider('Default position %', e.flags.default_position, 0, 100, 1, (v) =>
              this._patchFlags(idx, { default_position: v }),
            )}
            ${this._checkbox('Throttle pending', e.flags.throttle_pending, (v) =>
              this._patchFlags(idx, { throttle_pending: v }),
            )}
            ${e.flags.throttle_pending
              ? html`
                  ${this._numberSlider(
                    'Skipped … min ago',
                    e.flags.throttle_skipped_minutes_ago,
                    0,
                    60,
                    1,
                    (v) => this._patchFlags(idx, { throttle_skipped_minutes_ago: v }),
                  )}
                  ${this._numberSlider(
                    'Interval (min)',
                    e.flags.throttle_threshold_minutes,
                    1,
                    60,
                    1,
                    (v) => this._patchFlags(idx, { throttle_threshold_minutes: v }),
                  )}
                `
              : ''}
          </fieldset>
        `,
      )}
    `;
  }

  private _patchFlags(idx: number, patch: Partial<HarnessEntry['flags']>): void {
    const entries = this.config.entries.map((e, i) =>
      i === idx ? { ...e, flags: { ...e.flags, ...patch } } : e,
    );
    this._emit({ ...this.config, entries });
  }

  private _renderDecision(): TemplateResult {
    return html`
      <label class="row">
        <span>Mode</span>
        <select
          @change=${(e: Event) =>
            this._emit({
              ...this.config,
              decisionMode: (e.target as HTMLSelectElement).value as 'derived' | 'scripted',
            })}
        >
          <option value="derived" ?selected=${this.config.decisionMode === 'derived'}>
            Derived (from state)
          </option>
          <option value="scripted" ?selected=${this.config.decisionMode === 'scripted'}>
            Scripted (force a winner)
          </option>
        </select>
      </label>
      ${this.config.decisionMode === 'scripted'
        ? html`
            <label class="row">
              <span>Winner</span>
              <select
                @change=${(e: Event) =>
                  this._emit({
                    ...this.config,
                    scriptedWinner: (e.target as HTMLSelectElement).value as HandlerName,
                  })}
              >
                ${HANDLER_ORDER.map(
                  (h) =>
                    html`<option value=${h} ?selected=${this.config.scriptedWinner === h}>
                      ${h}
                    </option>`,
                )}
              </select>
            </label>
            <fieldset class="entry">
              <legend>Also matched, not winning (issue #223)</legend>
              ${HANDLER_ORDER.filter((h) => h !== this.config.scriptedWinner).map((h) =>
                this._checkbox(h, (this.config.scriptedAlsoMatched ?? []).includes(h), (v) => {
                  const current = this.config.scriptedAlsoMatched ?? [];
                  const scriptedAlsoMatched = v ? [...current, h] : current.filter((x) => x !== h);
                  this._emit({ ...this.config, scriptedAlsoMatched });
                }),
              )}
            </fieldset>
          `
        : ''}
    `;
  }

  private _renderSlots(): TemplateResult {
    return html`
      ${this.config.entries.map(
        (e, idx) => html`
          <fieldset class="entry">
            <legend>${e.title}</legend>
            ${e.slots.map(
              (s, si) => html`
                <div class="slot-row">
                  <input
                    type="checkbox"
                    .checked=${s.enabled}
                    title="Enable slot"
                    @change=${(ev: Event) => {
                      const slots = e.slots.map((ss, i) =>
                        i === si ? { ...ss, enabled: (ev.target as HTMLInputElement).checked } : ss,
                      );
                      this._patchEntry(idx, { slots });
                    }}
                  />
                  <span class="slot-num">#${s.slot}</span>
                  <input
                    type="text"
                    .value=${s.name}
                    @change=${(ev: Event) => {
                      const slots = e.slots.map((ss, i) =>
                        i === si ? { ...ss, name: (ev.target as HTMLInputElement).value } : ss,
                      );
                      this._patchEntry(idx, { slots });
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    .value=${String(s.position)}
                    @change=${(ev: Event) => {
                      const slots = e.slots.map((ss, i) =>
                        i === si
                          ? { ...ss, position: parseInt((ev.target as HTMLInputElement).value, 10) }
                          : ss,
                      );
                      this._patchEntry(idx, { slots });
                    }}
                  />
                  <label class="inline">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      step="1"
                      title="Slot priority (1–99); >80 resists a manual ↓"
                      .value=${String(s.priority)}
                      @change=${(ev: Event) => {
                        const slots = e.slots.map((ss, i) =>
                          i === si
                            ? {
                                ...ss,
                                priority: parseInt((ev.target as HTMLInputElement).value, 10),
                              }
                            : ss,
                        );
                        this._patchEntry(idx, { slots });
                      }}
                    />
                    prio
                  </label>
                  <label class="inline">
                    <input
                      type="checkbox"
                      .checked=${s.min_mode}
                      @change=${(ev: Event) => {
                        const slots = e.slots.map((ss, i) =>
                          i === si
                            ? { ...ss, min_mode: (ev.target as HTMLInputElement).checked }
                            : ss,
                        );
                        this._patchEntry(idx, { slots });
                      }}
                    />
                    min
                  </label>
                </div>
              `,
            )}
          </fieldset>
        `,
      )}
    `;
  }

  private _renderCardOptions(): TemplateResult {
    return html`
      <fieldset class="entry">
        <legend>Root card</legend>
        ${this._checkbox('Enabled', this.config.root.enabled, (v) =>
          this._emit({ ...this.config, root: { ...this.config.root, enabled: v } }),
        )}
        ${this._checkbox('Compact', this.config.root.compact, (v) =>
          this._emit({ ...this.config, root: { ...this.config.root, compact: v } }),
        )}
        ${this._checkbox('Show compass stats', this.config.root.show_compass_stats, (v) =>
          this._emit({ ...this.config, root: { ...this.config.root, show_compass_stats: v } }),
        )}
        ${this._checkbox('Show compass legend', this.config.root.show_compass_legend, (v) =>
          this._emit({ ...this.config, root: { ...this.config.root, show_compass_legend: v } }),
        )}
        ${this._checkbox('Show moon', this.config.root.show_moon, (v) =>
          this._emit({ ...this.config, root: { ...this.config.root, show_moon: v } }),
        )}
        ${this._checkbox('Hide inactive handlers', this.config.root.hide_inactive_handlers, (v) =>
          this._emit({
            ...this.config,
            root: { ...this.config.root, hide_inactive_handlers: v },
          }),
        )}
        ${this._checkbox('Show decision summary', this.config.root.show_decision_summary, (v) =>
          this._emit({
            ...this.config,
            root: { ...this.config.root, show_decision_summary: v },
          }),
        )}
        ${this._checkbox('Color icon by state', this.config.root.state_color, (v) =>
          this._emit({ ...this.config, root: { ...this.config.root, state_color: v } }),
        )}
        ${this._numberSlider('North offset °', this.config.root.north_offset, -180, 180, 1, (v) =>
          this._emit({ ...this.config, root: { ...this.config.root, north_offset: v } }),
        )}
        <p class="hint">Sections to show:</p>
        ${(
          ['sky', 'elevation', 'decision', 'covers', 'overrides', 'climate', 'solar'] as const
        ).map((s) =>
          this._checkbox(s, this.config.root.show_sections[s], (v) =>
            this._emit({
              ...this.config,
              root: {
                ...this.config.root,
                show_sections: { ...this.config.root.show_sections, [s]: v },
              },
            }),
          ),
        )}
      </fieldset>

      <fieldset class="entry">
        <legend>Sky compass card</legend>
        ${this._checkbox('Enabled', this.config.compass.enabled, (v) =>
          this._emit({ ...this.config, compass: { ...this.config.compass, enabled: v } }),
        )}
        ${this._textRow('Title', this.config.compass.title, (v) =>
          this._emit({ ...this.config, compass: { ...this.config.compass, title: v } }),
        )}
        ${(
          [
            'compact',
            'show_legend',
            'show_stats',
            'show_moon',
            'show_cardinals',
            'show_blind_spot',
            'show_sun_path',
            'show_sunrise_sunset',
            'show_cover_fill',
            'show_window_arrow',
            'show_elevation_chart',
          ] as const
        ).map((k) =>
          this._checkbox(k, this.config.compass[k], (v) =>
            this._emit({ ...this.config, compass: { ...this.config.compass, [k]: v } }),
          ),
        )}
        ${this._numberSlider(
          'North offset °',
          this.config.compass.north_offset,
          -180,
          180,
          1,
          (v) =>
            this._emit({ ...this.config, compass: { ...this.config.compass, north_offset: v } }),
        )}
        ${this._numberSlider(
          'stage height px (0 = grow)',
          this.config.stageHeight,
          0,
          800,
          20,
          (v) => this._emit({ ...this.config, stageHeight: v }),
        )}
      </fieldset>

      <fieldset class="entry">
        <legend>Tile card</legend>
        ${this._checkbox('Enabled', this.config.tile.enabled, (v) =>
          this._emit({ ...this.config, tile: { ...this.config.tile, enabled: v } }),
        )}
        ${(
          [
            'show_position',
            'show_state',
            'show_decision_summary',
            'show_controls',
            'show_badge',
            'show_position_bar',
            'show_tilt',
            'show_scene_select',
            'show_lock',
            'show_automation',
            'show_clear_overrides',
            'show_member_badges',
            'show_compass',
            'show_elevation_chart',
            'show_solar_calc',
            'show_motion_icon',
            'state_color',
          ] as const
        ).map((k) =>
          this._checkbox(k, this.config.tile[k], (v) =>
            this._emit({ ...this.config, tile: { ...this.config.tile, [k]: v } }),
          ),
        )}
        <fieldset class="entry">
          <legend>Badges (opt-in)</legend>
          ${(
            [
              'auto',
              'solar',
              'force',
              'weather',
              'manual',
              'custom_position',
              'motion',
              'climate',
              'glare_zone',
              'cloud',
            ] as const
          ).map((k) =>
            this._checkbox(`badge: ${k}`, this.config.tile.badges?.[k] ?? true, (v) =>
              this._emit({
                ...this.config,
                tile: {
                  ...this.config.tile,
                  badges: { ...(this.config.tile.badges ?? {}), [k]: v },
                },
              }),
            ),
          )}
        </fieldset>
        <label class="row">
          <span>layout</span>
          <select
            @change=${(e: Event) =>
              this._emit({
                ...this.config,
                tile: {
                  ...this.config.tile,
                  layout: (e.target as HTMLSelectElement).value as 'one-line' | 'detailed',
                },
              })}
          >
            ${(['one-line', 'detailed'] as const).map(
              (v) =>
                html`<option value=${v} ?selected=${this.config.tile.layout === v}>${v}</option>`,
            )}
          </select>
        </label>
        ${this._numberSlider(
          'tile width px (0 = auto)',
          this.config.tile.tileWidth,
          0,
          480,
          10,
          (v) => this._emit({ ...this.config, tile: { ...this.config.tile, tileWidth: v } }),
        )}
      </fieldset>

      <fieldset class="entry">
        <legend>Decision card</legend>
        ${this._checkbox('Enabled', this.config.decision.enabled, (v) =>
          this._emit({ ...this.config, decision: { ...this.config.decision, enabled: v } }),
        )}
        ${this._textRow('Title', this.config.decision.title, (v) =>
          this._emit({ ...this.config, decision: { ...this.config.decision, title: v } }),
        )}
        ${(['compact', 'hide_inactive_handlers', 'show_decision_summary'] as const).map((k) =>
          this._checkbox(k, this.config.decision[k], (v) =>
            this._emit({ ...this.config, decision: { ...this.config.decision, [k]: v } }),
          ),
        )}
      </fieldset>

      <fieldset class="entry">
        <legend>Solar chart card</legend>
        ${this._checkbox('Enabled', this.config.solarChart.enabled, (v) =>
          this._emit({ ...this.config, solarChart: { ...this.config.solarChart, enabled: v } }),
        )}
        ${this._textRow('Title', this.config.solarChart.title, (v) =>
          this._emit({ ...this.config, solarChart: { ...this.config.solarChart, title: v } }),
        )}
        ${this._checkbox('compact', this.config.solarChart.compact, (v) =>
          this._emit({ ...this.config, solarChart: { ...this.config.solarChart, compact: v } }),
        )}
      </fieldset>
    `;
  }

  // ─── primitive form helpers ──────────────────────────────────────

  private _numberSlider(
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (v: number) => void,
  ): TemplateResult {
    return html`
      <label class="row">
        <span>${label}</span>
        <span class="slider-readout">${value}</span>
      </label>
      <input
        type="range"
        min=${min}
        max=${max}
        step=${step}
        .value=${String(value)}
        @input=${(e: Event) => onChange(parseFloat((e.target as HTMLInputElement).value))}
      />
    `;
  }

  private _optionalNumber(
    label: string,
    value: number | undefined,
    min: number,
    max: number,
    onChange: (v: number | undefined) => void,
  ): TemplateResult {
    return html`
      <label class="row">
        <span>${label}</span>
        <input
          type="checkbox"
          .checked=${value !== undefined}
          @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked ? 10 : undefined)}
        />
        ${value !== undefined
          ? html`<input
              class="inline-num"
              type="number"
              min=${min}
              max=${max}
              .value=${String(value)}
              @change=${(e: Event) => onChange(parseFloat((e.target as HTMLInputElement).value))}
            />`
          : ''}
      </label>
    `;
  }

  /** A schedule bound (minutes-from-midnight) with a "no bound" null toggle.
   *  Unchecking the box sets null (open/blank); checking restores a default. */
  private _scheduleBound(
    label: string,
    value: number | null,
    onChange: (v: number | null) => void,
  ): TemplateResult {
    const hh = value === null ? '' : String(Math.floor(value / 60)).padStart(2, '0');
    const mm = value === null ? '' : String(value % 60).padStart(2, '0');
    return html`
      <label class="row">
        <span>${label}${value === null ? ' (no bound)' : ` ${hh}:${mm}`}</span>
        <input
          type="checkbox"
          .checked=${value !== null}
          @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked ? 12 * 60 : null)}
        />
      </label>
      ${value !== null
        ? html`<input
            type="range"
            min="0"
            max="1439"
            step="15"
            .value=${String(value)}
            @input=${(e: Event) => onChange(parseInt((e.target as HTMLInputElement).value, 10))}
          />`
        : ''}
    `;
  }

  private _checkbox(label: string, value: boolean, onChange: (v: boolean) => void): TemplateResult {
    return html`
      <label class="row checkbox">
        <span>${label}</span>
        <input
          type="checkbox"
          .checked=${value}
          @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)}
        />
      </label>
    `;
  }

  private _textRow(label: string, value: string, onChange: (v: string) => void): TemplateResult {
    return html`
      <label class="row">
        <span>${label}</span>
        <input
          type="text"
          .value=${value}
          @change=${(e: Event) => onChange((e.target as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  public static styles = css`
    :host {
      display: block;
      padding: 8px;
      font-size: 0.85rem;
    }
    section {
      border: 1px solid var(--harness-border);
      border-radius: 6px;
      margin-bottom: 8px;
      background: var(--harness-panel-bg);
    }
    section header {
      display: flex;
      gap: 8px;
      padding: 6px 10px;
      cursor: pointer;
      user-select: none;
      align-items: center;
    }
    section header .chev {
      width: 12px;
      color: var(--secondary-text-color);
    }
    section header .title {
      font-weight: 600;
    }
    section .body {
      padding: 8px 10px;
      border-top: 1px solid var(--harness-border);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .row.checkbox span {
      flex: 1 1 auto;
    }
    .row.buttons {
      gap: 4px;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .row input[type='number'],
    .row input[type='text'],
    .row input[type='date'],
    .row select,
    .row input[type='color'] {
      max-width: 140px;
      padding: 2px 4px;
      font-size: 0.85rem;
    }
    /* Scenario preset picker: a select flanked by − / + step buttons that cycle
       through the presets without opening the dropdown. */
    .scenario-picker {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .scenario-picker select {
      max-width: 116px;
    }
    .step-btn {
      flex: 0 0 auto;
      width: 22px;
      height: 22px;
      line-height: 1;
      padding: 0;
      font-size: 1rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .step-btn:hover {
      background: var(--divider-color, #ddd);
    }
    input[type='range'] {
      width: 100%;
    }
    .slider-readout {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
      min-width: 32px;
      text-align: right;
    }
    .time-display {
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .time-slider {
      margin-top: -2px;
    }
    .presets {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding-top: 4px;
    }
    button.ghost,
    button.primary {
      padding: 2px 8px;
      border: 1px solid var(--harness-border);
      background: transparent;
      color: inherit;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.78rem;
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }
    button.ghost:hover {
      background: var(--secondary-background-color);
    }
    button.tiny {
      padding: 0 6px;
      line-height: 1.6;
    }
    fieldset.entry {
      border: 1px solid var(--harness-border);
      border-radius: 4px;
      padding: 6px 8px;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    fieldset.entry legend {
      padding: 0 4px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .entries-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 4px;
    }
    .covers,
    .covers-head {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .covers-head {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .cover-row {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .cover-row input[type='text'] {
      flex: 1 1 auto;
      max-width: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.75rem;
    }
    .cover-row input[type='number'] {
      width: 60px;
    }
    .slot-row {
      display: grid;
      grid-template-columns: auto auto 1fr 60px auto;
      gap: 4px;
      align-items: center;
    }
    .slot-num {
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
    }
    .inline {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.78rem;
    }
    .inline-num {
      width: 60px;
      margin-left: 4px;
    }
    .hint {
      margin: 4px 0;
      color: var(--secondary-text-color);
      font-style: italic;
      font-size: 0.78rem;
    }
  `;
}
