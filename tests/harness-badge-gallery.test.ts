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
