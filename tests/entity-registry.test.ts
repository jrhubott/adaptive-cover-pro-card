import { describe, it, expect, vi } from 'vitest';
import { subscribeEntityRegistry } from '../src/lib/entity-registry';
import type { HomeAssistant } from 'custom-card-helpers';
import type { RegistryEventPayload } from '../src/lib/registry-diff';

function makeHass(
  subscribeEvents: (cb: (ev: { data: unknown }) => void, event: string) => Promise<() => void>,
): HomeAssistant {
  return {
    connection: { subscribeEvents },
  } as unknown as HomeAssistant;
}

describe('subscribeEntityRegistry', () => {
  it('calls onChange with forwarded event payload', async () => {
    const received: RegistryEventPayload[] = [];
    let capturedCallback: ((ev: { data: unknown }) => void) | null = null;

    const hass = makeHass(async (cb, _event) => {
      capturedCallback = cb;
      return () => {};
    });

    subscribeEntityRegistry(hass, (payload) => received.push(payload));

    // Wait for the async subscribeEvents to resolve
    await Promise.resolve();

    const event: RegistryEventPayload = { action: 'update', entity_id: 'sensor.foo' };
    capturedCallback!({ data: event });

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(event);
  });

  it('returns a teardown function that unsubscribes', async () => {
    const unsub = vi.fn();
    const hass = makeHass(async () => unsub);
    const teardown = subscribeEntityRegistry(hass, () => {});
    await Promise.resolve();
    teardown();
    expect(unsub).toHaveBeenCalledOnce();
  });

  it('cancels subscription if teardown is called before subscribe resolves', async () => {
    const unsub = vi.fn();
    let resolve!: (fn: () => void) => void;
    const hass = makeHass(
      () =>
        new Promise<() => void>((r) => {
          resolve = r;
        }),
    );
    const teardown = subscribeEntityRegistry(hass, () => {});
    teardown(); // cancel before promise resolves
    resolve(unsub);
    await Promise.resolve();
    expect(unsub).toHaveBeenCalledOnce(); // immediately unsubbed after resolving
  });
});
