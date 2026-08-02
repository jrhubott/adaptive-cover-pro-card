import type { HomeAssistant } from 'custom-card-helpers';

/**
 * Battery level for a managed cover.
 *
 * A cover's battery is never an ACP entity — it belongs to the cover's own
 * device (a Zigbee shade motor, say), so it can't come from `discoverEntities`.
 * We reach it through the *display* entity registry (`hass.entities`), which
 * carries `device_id` for every entity: resolve the cover's device, then find a
 * `device_class: battery` sensor sitting on that same device.
 *
 * Some integrations skip the separate sensor and put `battery_level` straight on
 * the cover's own attributes; that path is checked first since it needs no
 * registry walk at all.
 */
export interface CoverBattery {
  /** The cover this level belongs to. */
  cover_id: string;
  /** The entity the level was read from — the battery sensor, or the cover
   *  itself when it exposes `battery_level` directly. */
  source_id: string;
  /** 0–100, or null when the source is unavailable/non-numeric. */
  level: number | null;
  charging: boolean;
}

interface EntityDisplayEntry {
  device_id?: string | null;
}

/** `hass.entities` is the synchronous display registry — a subset of the full
 *  websocket registry that omits `unique_id`/`config_entry_id` but does carry
 *  `device_id`, which is all this lookup needs. Undeclared on
 *  `custom-card-helpers`' `HomeAssistant`, so declare it the same way
 *  `entity-discovery.ts` declares `hass.devices` / `hass.areas`. */
type HassWithEntities = HomeAssistant & {
  entities?: Record<string, EntityDisplayEntry>;
};

function numericLevel(raw: unknown): number | null {
  // Reject the empty-ish values BEFORE coercing: `Number(null)`, `Number('')`
  // and `Number([])` are all 0, so a cover reporting `battery_level: None` would
  // otherwise read as a flat 0% battery and paint a red low-battery warning
  // instead of the unknown-level icon.
  if (raw === null || raw === undefined || raw === '') return null;
  if (typeof raw !== 'number' && typeof raw !== 'string') return null;
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, n));
}

/**
 * Resolve a battery level per cover, in the order given. Covers with no battery
 * are simply absent from the result — the caller renders nothing for them.
 *
 * Walks `hass.entities` once and indexes by device, so N covers cost one pass
 * rather than N.
 */
export function resolveCoverBatteries(hass: HomeAssistant, coverIds: string[]): CoverBattery[] {
  if (!hass || coverIds.length === 0) return [];
  const registry = (hass as HassWithEntities).entities;

  // device_id → the battery sensor found on it.
  let batteryByDevice: Map<string, string> | null = null;
  const indexBatteries = (): Map<string, string> => {
    const index = new Map<string, string>();
    if (!registry) return index;
    for (const [entityId, entry] of Object.entries(registry)) {
      const deviceId = entry?.device_id;
      if (!deviceId) continue;
      // `sensor.` only. Z-Wave JS, ZHA and deCONZ all ship a
      // `binary_sensor.*_battery` (HA's BinarySensorDeviceClass.BATTERY is also
      // the string "battery") ALONGSIDE the percentage sensor, and it reports
      // on/off — "low battery yes/no", not a level. Accepting it meant
      // Number('off') → NaN → level null → treated as low, so a fully-charged
      // cover showed a permanent red warning depending purely on which of the
      // two enumerated first.
      if (!entityId.startsWith('sensor.')) continue;
      const state = hass.states[entityId];
      if (state?.attributes?.device_class !== 'battery') continue;

      const existing = index.get(deviceId);
      if (existing === undefined) {
        index.set(deviceId, entityId);
        continue;
      }
      // A device with several battery sensors: prefer one that is actually
      // reporting a number. Never SKIP a non-numeric one outright — a battery
      // sensor gone `unavailable` is exactly what the warning exists for, and
      // dropping it would silently hide a dead cell instead of flagging it.
      if (
        numericLevel(hass.states[existing]?.state) === null &&
        numericLevel(state.state) !== null
      ) {
        index.set(deviceId, entityId);
      }
    }
    return index;
  };

  const out: CoverBattery[] = [];
  for (const coverId of coverIds) {
    const coverState = hass.states[coverId];
    if (!coverState) continue;

    // 1. The cover carries the level itself.
    const inline = numericLevel(coverState.attributes?.battery_level);
    if (inline !== null) {
      out.push({
        cover_id: coverId,
        source_id: coverId,
        level: inline,
        charging: coverState.attributes?.battery_charging === true,
      });
      continue;
    }

    // 2. A battery sensor on the cover's device.
    const deviceId = registry?.[coverId]?.device_id;
    if (!deviceId) continue;
    batteryByDevice ??= indexBatteries();
    const sourceId = batteryByDevice.get(deviceId);
    if (!sourceId) continue;

    const source = hass.states[sourceId];
    out.push({
      cover_id: coverId,
      source_id: sourceId,
      level: numericLevel(source?.state),
      charging: source?.attributes?.battery_charging === true,
    });
  }
  return out;
}

/** At or below this percentage a battery is "low": the tile paints a warning
 *  overlay on its icon and the dialog's readout turns red. One constant so the
 *  two surfaces can never disagree about what low means. */
export const LOW_BATTERY_PCT = 20;

/** An unknown level counts as low — a battery sensor that has stopped reporting
 *  is exactly the case a warning exists for. */
export function isLowBattery(battery: CoverBattery | null): boolean {
  if (!battery) return false;
  return battery.level === null || battery.level <= LOW_BATTERY_PCT;
}

/** The lowest-charged battery in a set — what a single indicator should show.
 *  An unknown level (null) sorts worst, so a dead sensor is never hidden behind
 *  a healthy sibling. */
export function lowestBattery(batteries: CoverBattery[]): CoverBattery | null {
  let worst: CoverBattery | null = null;
  for (const b of batteries) {
    if (!worst) worst = b;
    else if (b.level === null) worst = worst.level === null ? worst : b;
    else if (worst.level !== null && b.level < worst.level) worst = b;
  }
  return worst;
}

/**
 * MDI icon for a level, matching HA's own battery iconography: `mdi:battery` at
 * full, `mdi:battery-alert-variant-outline` when the level is unknown, and
 * `mdi:battery-N0` / `mdi:battery-charging-N0` in between (N rounded down to the
 * nearest 10, since a 9% battery should not read as `battery-10`).
 */
export function batteryIcon(level: number | null, charging = false): string {
  if (level === null) return 'mdi:battery-alert-variant-outline';
  const step = Math.max(0, Math.min(10, Math.floor(level / 10)));
  if (step === 10) return charging ? 'mdi:battery-charging-100' : 'mdi:battery';
  if (step === 0) return charging ? 'mdi:battery-charging-10' : 'mdi:battery-outline';
  return charging ? `mdi:battery-charging-${step * 10}` : `mdi:battery-${step * 10}`;
}
