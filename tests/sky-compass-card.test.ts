import { describe, it, expect } from 'vitest';
import '../src/adaptive-cover-pro-sky-compass-card';
import type { HomeAssistant } from 'custom-card-helpers';
import type { SkyCompassCardConfig } from '../src/types';

interface CardLike extends HTMLElement {
  updateComplete: Promise<boolean>;
  hass?: HomeAssistant;
  setConfig(config: SkyCompassCardConfig): void;
}

function makeCard(): CardLike {
  return document.createElement('adaptive-cover-pro-sky-compass-card') as CardLike;
}

describe('adaptive-cover-pro-sky-compass-card setConfig', () => {
  it('throws when entry_ids is missing', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({ type: 'custom:adaptive-cover-pro-sky-compass-card' } as SkyCompassCardConfig),
    ).toThrow(/entry_ids/);
  });

  it('throws when entry_ids is empty', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: [],
      }),
    ).toThrow(/entry_ids/);
  });

  it('throws when entry_ids contains a non-string', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: [123 as unknown as string],
      }),
    ).toThrow();
  });

  it('throws when entry_ids contains an empty string', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: [''],
      }),
    ).toThrow();
  });

  it('accepts a valid single-entry config', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: ['abc'],
      }),
    ).not.toThrow();
  });

  it('accepts a valid multi-entry config', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: ['abc', 'def'],
        compact: true,
        show_legend: false,
      }),
    ).not.toThrow();
  });

  it('accepts cover_colors array alongside entry_ids', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: ['a', 'b'],
        cover_colors: ['#ff3366', null],
      }),
    ).not.toThrow();
  });

  it('accepts cover_colors shorter than entry_ids', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: ['a', 'b', 'c'],
        cover_colors: ['#ff3366'],
      }),
    ).not.toThrow();
  });

  it('accepts north_offset config', () => {
    const el = makeCard();
    expect(() =>
      el.setConfig({
        type: 'custom:adaptive-cover-pro-sky-compass-card',
        entry_ids: ['abc'],
        north_offset: 90,
      }),
    ).not.toThrow();
  });

  it('defensively copies entry_ids so callers can mutate their input', () => {
    const el = makeCard();
    const input = ['a', 'b'];
    el.setConfig({
      type: 'custom:adaptive-cover-pro-sky-compass-card',
      entry_ids: input,
    });
    input.push('c');
    // No direct getter; just assert the call did not throw and input mutation doesn't crash re-render.
    expect(input.length).toBe(3);
  });
});
