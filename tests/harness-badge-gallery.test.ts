import { describe, it, expect } from 'vitest';
import '../harness/src/badge-gallery';
import { BADGE_TOKENS } from '../src/const';

interface GalleryLike extends HTMLElement {
  updateComplete: Promise<boolean>;
}

async function mountGallery(): Promise<GalleryLike> {
  const el = document.createElement('acp-harness-badge-gallery') as GalleryLike;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('acp-harness-badge-gallery', () => {
  it('renders one badge per BadgeKind in the all-kinds grid', async () => {
    const el = await mountGallery();
    const badges = el.shadowRoot!.querySelectorAll('#kinds acp-tile-badge');
    expect(badges.length).toBe(Object.keys(BADGE_TOKENS).length);
  });

  it('labels each kind cell with its BadgeKind name', async () => {
    const el = await mountGallery();
    const labels = Array.from(el.shadowRoot!.querySelectorAll('#kinds .label')).map((n) =>
      n.textContent!.trim(),
    );
    expect(labels.sort()).toEqual(Object.keys(BADGE_TOKENS).sort());
  });

  it('renders the contextual variants section', async () => {
    const el = await mountGallery();
    const variants = el.shadowRoot!.querySelectorAll('#variants acp-tile-badge');
    expect(variants.length).toBeGreaterThan(0);
  });
});

// Issue #229: the two-action badge is a gallery variant so the restructured
// container is visible in the harness alongside the resumable-only form.
describe('acp-harness-badge-gallery — extend variants (#229)', () => {
  it('renders an extendable + resumable two-button variant', async () => {
    const el = await mountGallery();
    const badges = Array.from(el.shadowRoot!.querySelectorAll('#variants acp-tile-badge')) as Array<
      HTMLElement & { updateComplete: Promise<boolean> }
    >;
    const twoAction = badges.filter((b) => b.hasAttribute('extendable'));
    expect(twoAction.length).toBeGreaterThanOrEqual(2); // regular + compact
    await Promise.all(twoAction.map((b) => b.updateComplete));
    for (const b of twoAction) {
      expect(b.shadowRoot!.querySelector('button.act.extend')).toBeTruthy();
      // No nested buttons — the whole point of the restructure.
      expect(b.shadowRoot!.querySelector('button.badge')).toBeFalsy();
    }
    expect(twoAction.some((b) => b.hasAttribute('compact'))).toBe(true);
  });
});
