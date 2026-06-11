import { describe, it, expect, vi } from 'vitest';
import '../src/components/cover-bar';
import { CoverBar } from '../src/components/cover-bar';
import { INTEGRATION_DOMAIN } from '../src/const';
import type { HomeAssistant } from 'custom-card-helpers';
import type { DiscoveredEntities } from '../src/types';
import type { CSSResult } from 'lit';

interface CoverBarLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  discovered?: DiscoveredEntities;
}

const baseDiscovered: DiscoveredEntities = {
  entry_id: 'entry1',
  entry_title: 'Test',
  cover_type: 'cover_blind',
  entities: {},
  managed_covers: [],
};

describe('acp-cover-bar fill style — issue #135', () => {
  it('fill CSS uses color-mix for reduced opacity', () => {
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
    expect(styles).toContain('color-mix');
  });

  it('renders the percent label before the track', async () => {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '31',
          attributes: {
            actual_positions: { 'cover.living_room': 31 },
          },
        },
        'cover.living_room': {
          state: 'open',
          attributes: { friendly_name: 'Living Room' },
        },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };

    await el.updateComplete;

    const cover = el.shadowRoot!.querySelector('.cover')!;
    const children = Array.from(cover.children);
    const numIdx = children.findIndex((c) => c.classList.contains('num'));
    const trackIdx = children.findIndex((c) => c.classList.contains('track'));
    expect(numIdx).toBeGreaterThanOrEqual(0);
    expect(trackIdx).toBeGreaterThanOrEqual(0);
    expect(numIdx).toBeLessThan(trackIdx);
  });
});

describe('acp-cover-bar two-tone fill — issue #135 follow-up', () => {
  it('both segments derive from the cover colour — open pale, closed solid', () => {
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
    // Open portion (.fill) and closed portion (.fill-closed) share the cover hue
    // (override, else --primary-color); no gold, so nothing competes with the
    // gold sun on the compass. Open is the fainter mix, closed the stronger.
    expect(styles).toMatch(/\.fill\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*18%/);
    expect(styles).toMatch(
      /\.fill-closed\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)\)\s*50%/,
    );
    // The fills no longer borrow the FOV gold (.warn still uses --warning-color).
    expect(styles).not.toMatch(/\.fill[^}]*--warning-color/);
  });

  it('splits the track into open + closed widths summing to 100%', async () => {
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '69',
          attributes: {
            actual_positions: { 'cover.gauche': 69 },
          },
        },
        'cover.gauche': {
          state: 'open',
          attributes: { friendly_name: 'Gauche cover' },
        },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };

    await el.updateComplete;

    const open = el.shadowRoot!.querySelector('.fill') as HTMLElement;
    const closed = el.shadowRoot!.querySelector('.fill-closed') as HTMLElement;
    expect(open.style.width).toBe('69%');
    expect(closed.style.width).toBe('31%');
  });

  it('closed segment falls back to --primary-color when no cover colour is set', () => {
    const styles = (CoverBar as unknown as { styles: CSSResult }).styles.cssText;
    expect(styles).toMatch(/\.fill-closed\s*{[^}]*--acp-cover-color,\s*var\(--primary-color\)/);
  });

  it('applies the user-selected cover colour as the --acp-cover-color var', async () => {
    const el = document.createElement('acp-cover-bar') as CoverBarLike & {
      coverColor?: string | null;
    };
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '69',
          attributes: { actual_positions: { 'cover.gauche': 69 } },
        },
        'cover.gauche': {
          state: 'open',
          attributes: { friendly_name: 'Gauche cover' },
        },
      },
      callService: vi.fn(),
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };
    el.coverColor = '#ff7043';

    await el.updateComplete;

    const wrap = el.shadowRoot!.querySelector('.wrap') as HTMLElement;
    expect(wrap.style.getPropertyValue('--acp-cover-color')).toBe('#ff7043');
  });
});

describe('acp-cover-bar track-click → set_position', () => {
  it('calls adaptive_cover_pro.set_position when the track is clicked', async () => {
    const callService = vi.fn();
    const el = document.createElement('acp-cover-bar') as CoverBarLike;
    document.body.appendChild(el);

    el.hass = {
      states: {
        'sensor.cover_position': {
          state: '40',
          attributes: {
            actual_positions: { 'cover.left': 40 },
          },
        },
        'cover.left': {
          state: 'open',
          attributes: { friendly_name: 'Left' },
        },
      },
      callService,
    } as unknown as HomeAssistant;

    el.discovered = {
      ...baseDiscovered,
      entities: { target_position_sensor: 'sensor.cover_position' },
    };

    await el.updateComplete;

    const track = el.shadowRoot!.querySelector('.track') as HTMLElement;
    // Simulate a click at 50% of the track.
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100, top: 0, bottom: 10, right: 100, height: 10 }),
      configurable: true,
    });
    track.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }));

    expect(callService).toHaveBeenCalledWith(
      INTEGRATION_DOMAIN,
      'set_position',
      { position: 50 },
      { entity_id: 'cover.left' },
    );
  });
});
