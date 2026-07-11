// Issue #178 — rename card-owned "Motion" display strings to "Occupancy" wording.
// Pins the new occupancy wording (en/fr/de + const fallbacks) and guards that
// every FROZEN internal identifier (handler keys, badge kinds, i18n key paths,
// normalizeHandler mappings) is untouched.
import { describe, expect, it } from 'vitest';

import { en } from '../src/lib/i18n/en';
import { fr } from '../src/lib/i18n/fr';
import { de } from '../src/lib/i18n/de';
import { HANDLER_LABELS, HANDLER_ORDER, BADGE_TOKENS, BADGE_KINDS_BY_HANDLER } from '../src/const';
import { normalizeHandler } from '../src/lib/decision-summary';

describe('occupancy rename — English display strings', () => {
  it('renames handler.motion to Occupancy Timeout', () => {
    expect(en.handler.motion).toBe('Occupancy Timeout');
  });
  it('renames badge.motion to Occupancy idle', () => {
    expect(en.badge.motion).toBe('Occupancy idle');
  });
  it('renames overrides.motion to Occupancy', () => {
    expect(en.overrides.motion).toBe('Occupancy');
  });
  it('renames dialog.motion to Occupancy', () => {
    expect(en.dialog.motion).toBe('Occupancy');
  });
  it('renames tile.motion_detected to Occupancy detected', () => {
    expect(en.tile.motion_detected).toBe('Occupancy detected');
  });
  it('renames tile.motion_pending to Occupancy timeout pending', () => {
    expect(en.tile.motion_pending).toBe('Occupancy timeout pending');
  });
  it('renames editor.tile.badge_motion to Occupancy', () => {
    expect(en.editor.tile.badge_motion).toBe('Occupancy');
  });
  it('renames editor.tile.show_motion_icon to Show occupancy indicator', () => {
    expect(en.editor.tile.show_motion_icon).toBe('Show occupancy indicator');
  });
  it('renames editor overrides section desc to occupancy wording', () => {
    expect(en.editor.main.section_overrides_desc).toMatch(/occupancy/i);
    expect(en.editor.main.section_overrides_desc).not.toMatch(/motion/i);
  });
});

describe('occupancy rename — const.ts English fallbacks', () => {
  it('renames HANDLER_LABELS.motion to Occupancy Timeout', () => {
    expect(HANDLER_LABELS.motion).toBe('Occupancy Timeout');
  });
  it('renames BADGE_TOKENS.motion.label to Occupancy', () => {
    expect(BADGE_TOKENS.motion.label).toBe('Occupancy');
  });
});

describe('occupancy rename — French display strings', () => {
  it('uses occupancy (Occupation) wording, never Mouvement/Inactivité, for renamed keys', () => {
    for (const value of [
      fr.handler.motion,
      fr.badge.motion,
      fr.overrides.motion,
      fr.dialog.motion,
      fr.tile.motion_detected,
      fr.tile.motion_pending,
      fr.editor.tile.badge_motion,
      fr.editor.tile.show_motion_icon,
      fr.editor.main.section_overrides_desc,
    ]) {
      expect(value).toMatch(/occupation/i);
      expect(value).not.toMatch(/mouvement/i);
    }
  });
});

describe('occupancy rename — German display strings', () => {
  it('uses occupancy (Anwesenheit) wording, never Bewegung, for renamed keys', () => {
    for (const value of [
      de.handler.motion,
      de.badge.motion,
      de.overrides.motion,
      de.dialog.motion,
      de.tile.motion_detected,
      de.tile.motion_pending,
      de.editor.tile.badge_motion,
      de.editor.tile.show_motion_icon,
      de.editor.main.section_overrides_desc,
    ]) {
      expect(value).toMatch(/anwesenheit/i);
      expect(value).not.toMatch(/bewegung/i);
    }
  });
});

describe('occupancy rename — FROZEN internal identifiers must be untouched', () => {
  it('keeps the motion handler key in HANDLER_ORDER', () => {
    expect(HANDLER_ORDER).toContain('motion');
  });
  it('keeps BADGE_KINDS_BY_HANDLER.motion === motion', () => {
    expect(BADGE_KINDS_BY_HANDLER.motion).toBe('motion');
  });
  it('keeps normalizeHandler("MotionTimeoutHandler") === motion', () => {
    expect(normalizeHandler('MotionTimeoutHandler')).toBe('motion');
  });
  it('keeps normalizeHandler("motion_timeout") === motion', () => {
    expect(normalizeHandler('motion_timeout')).toBe('motion');
  });
  it('keeps the i18n motion key paths present (values are strings)', () => {
    expect(typeof en.badge.motion).toBe('string');
    expect(typeof en.handler.motion).toBe('string');
    expect(typeof en.overrides.motion).toBe('string');
    expect(typeof en.dialog.motion).toBe('string');
    expect(typeof en.tile.motion_detected).toBe('string');
    expect(typeof en.tile.motion_pending).toBe('string');
    expect(typeof en.editor.tile.badge_motion).toBe('string');
    expect(typeof en.editor.tile.show_motion_icon).toBe('string');
  });
});
