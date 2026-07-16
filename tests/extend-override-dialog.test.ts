import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/components/extend-override-dialog';
import type { OverridePreset } from '../src/lib/override-presets';
import type { HomeAssistant } from 'custom-card-helpers';

// Fixed "now" so relative chips and the tomorrow-roll are deterministic.
const NOW = new Date('2026-06-15T14:00:00Z');
const CURRENT_END = new Date('2026-06-15T15:00:00Z').getTime();

interface DialogLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  open?: boolean;
  presets?: OverridePreset[];
  currentEndMs?: number;
}

const hass = { language: 'en', states: {}, callService: vi.fn() } as unknown as HomeAssistant;

const PRESETS: OverridePreset[] = [
  { kind: 'fov_exit', t: '2026-06-15T15:30:00Z', label: 'Sun leaves window' },
  { kind: 'sunset', t: '2026-06-15T19:58:00Z', label: 'Sunset' },
  { kind: 'weird_kind', t: '2026-06-15T21:00:00Z', label: 'Custom moment' },
];

async function mount(props: Partial<DialogLike> = {}): Promise<DialogLike> {
  const el = document.createElement('acp-extend-override-dialog') as DialogLike;
  Object.assign(el, { hass, open: true, presets: PRESETS, currentEndMs: CURRENT_END }, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function q<T extends Element>(el: DialogLike, sel: string): T {
  return el.shadowRoot!.querySelector(sel) as T;
}

function previewText(el: DialogLike): string {
  return q<HTMLElement>(el, '.preview')!.textContent!.replace(/\s+/g, ' ').trim();
}

/** The instant the dialog would send, read back off the confirm button. */
function confirmedEndMs(el: DialogLike): number | undefined {
  let endMs: number | undefined;
  el.addEventListener('acp-extend-confirm', (e) => {
    endMs = (e as CustomEvent<{ endMs: number }>).detail.endMs;
  });
  q<HTMLButtonElement>(el, 'button.confirm').click();
  return endMs;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('acp-extend-override-dialog (#229)', () => {
  it('renders nothing open when closed', async () => {
    const el = await mount({ open: false });
    expect(q(el, '.backdrop[data-open]')).toBeFalsy();
  });

  it('is a modal dialog for assistive tech', async () => {
    const el = await mount();
    const dialog = q<HTMLElement>(el, '[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('renders one chip per preset, labeled from forecast.event.<kind> with a clock', async () => {
    const el = await mount();
    const chips = Array.from(el.shadowRoot!.querySelectorAll('button.preset'));
    expect(chips).toHaveLength(3);
    // fov_exit resolves through the i18n table.
    expect(chips[0].textContent).toContain('Sun leaves window sun acceptance angle');
    expect(chips[1].textContent).toContain('Sunset');
    // No translation for `weird_kind` → falls back to the event's own label.
    expect(chips[2].textContent).toContain('Custom moment');
    for (const chip of chips) {
      expect(chip.textContent).toMatch(/\d{1,2}:\d{2}/);
    }
  });

  it('previews the chosen preset time when a chip is tapped', async () => {
    const el = await mount();
    q<HTMLButtonElement>(el, 'button.preset').click();
    await el.updateComplete;
    expect(previewText(el)).toContain('Override until');
    expect(confirmedEndMs(el)).toBe(Date.parse('2026-06-15T15:30:00Z'));
  });

  it('adds relative time to the CURRENT override end, not to now', async () => {
    const el = await mount();
    q<HTMLButtonElement>(el, 'button.rel[data-mins="30"]').click();
    await el.updateComplete;
    // currentEnd 15:00Z + 30m = 15:30Z — NOT now (14:00Z) + 30m.
    expect(confirmedEndMs(el)).toBe(Date.parse('2026-06-15T15:30:00Z'));
  });

  it('falls back to now for relative chips when there is no readable current end', async () => {
    const el = await mount({ currentEndMs: undefined });
    q<HTMLButtonElement>(el, 'button.rel[data-mins="30"]').click();
    await el.updateComplete;
    expect(confirmedEndMs(el)).toBe(NOW.getTime() + 30 * 60_000);
  });

  it('stacks successive relative chips additively', async () => {
    const el = await mount();
    q<HTMLButtonElement>(el, 'button.rel[data-mins="30"]').click();
    await el.updateComplete;
    q<HTMLButtonElement>(el, 'button.rel[data-mins="15"]').click();
    await el.updateComplete;
    expect(confirmedEndMs(el)).toBe(Date.parse('2026-06-15T15:45:00Z'));
  });

  it('rolls an absolute time already past today over to tomorrow', async () => {
    const el = await mount();
    const input = q<HTMLInputElement>(el, 'input[type="time"]');
    // Local clock time one hour in the past.
    const past = new Date(NOW.getTime() - 60 * 60_000);
    const hh = String(past.getHours()).padStart(2, '0');
    const mm = String(past.getMinutes()).padStart(2, '0');
    input.value = `${hh}:${mm}`;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const endMs = confirmedEndMs(el)!;
    expect(endMs).toBeGreaterThan(NOW.getTime());
    // Same wall-clock time, tomorrow.
    const rolled = new Date(endMs);
    expect(rolled.getHours()).toBe(past.getHours());
    expect(rolled.getMinutes()).toBe(past.getMinutes());
    expect(rolled.getDate()).toBe(new Date(NOW.getTime() + 86_400_000).getDate());
  });

  it('keeps an absolute time later today as today', async () => {
    const el = await mount();
    const input = q<HTMLInputElement>(el, 'input[type="time"]');
    const future = new Date(NOW.getTime() + 3 * 60 * 60_000);
    const hh = String(future.getHours()).padStart(2, '0');
    const mm = String(future.getMinutes()).padStart(2, '0');
    input.value = `${hh}:${mm}`;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    const endMs = confirmedEndMs(el)!;
    expect(new Date(endMs).getDate()).toBe(NOW.getDate());
  });

  it('dispatches acp-extend-confirm with the previewed instant — it never calls the service itself', async () => {
    const el = await mount();
    q<HTMLButtonElement>(el, 'button.preset').click();
    await el.updateComplete;
    expect(confirmedEndMs(el)).toBe(Date.parse('2026-06-15T15:30:00Z'));
    // The write path lives in the tile card, mirroring acp-resume.
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it('disables confirm until a value is chosen', async () => {
    const el = await mount();
    expect(q<HTMLButtonElement>(el, 'button.confirm').disabled).toBe(true);
    q<HTMLButtonElement>(el, 'button.preset').click();
    await el.updateComplete;
    expect(q<HTMLButtonElement>(el, 'button.confirm').disabled).toBe(false);
  });

  it('closes on cancel without confirming', async () => {
    const el = await mount();
    q<HTMLButtonElement>(el, 'button.preset').click();
    await el.updateComplete;
    let confirmed = false;
    let closed = false;
    el.addEventListener('acp-extend-confirm', () => (confirmed = true));
    el.addEventListener('acp-extend-close', () => (closed = true));
    q<HTMLButtonElement>(el, 'button.cancel').click();
    expect(confirmed).toBe(false);
    expect(closed).toBe(true);
  });

  it('closes on backdrop click without confirming', async () => {
    const el = await mount();
    let confirmed = false;
    let closed = false;
    el.addEventListener('acp-extend-confirm', () => (confirmed = true));
    el.addEventListener('acp-extend-close', () => (closed = true));
    q<HTMLElement>(el, '.backdrop').click();
    expect(confirmed).toBe(false);
    expect(closed).toBe(true);
  });

  it('does not close when the dialog body itself is clicked', async () => {
    const el = await mount();
    let closed = false;
    el.addEventListener('acp-extend-close', () => (closed = true));
    q<HTMLElement>(el, '.dialog').click();
    expect(closed).toBe(false);
  });
});
