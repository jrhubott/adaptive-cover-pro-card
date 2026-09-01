/**
 * The one shadow-root hop for `<acp-rail-track>`, for the four rail surfaces'
 * test files.
 *
 * NOT a `*.test.ts` — vitest collects `tests/**\/*.test.ts` only, and a file
 * with no tests fails collection.
 *
 * #271 Part 2 moved the rail container behind a nested shadow boundary, and
 * `Element.querySelector()` never pierces one. Roughly 83 existing capture
 * lines across `cover-bar` / `tilt-bar` / `tile-card` / `group-tile` therefore
 * need one hop inserted. They all go through here rather than through inline
 * `.shadowRoot!.querySelector('acp-rail-track')!.shadowRoot!` chains, for two
 * reasons: the hop is then one reviewed function instead of 83 hand-typed ones,
 * and a rail that failed to render THROWS at the capture line instead of
 * null-flowing into an assertion that quietly stops meaning anything. Quietly
 * weakening the suite is the specific risk #271 flags about this refactor.
 */

/** Anything a test captures rails out of: a shadow root, an element, a
 *  document fragment. */
type Root = Pick<ParentNode, 'querySelectorAll'>;

/** A Lit element, structurally — enough for `railSettled` without importing
 *  every host component's class. */
interface Updatable {
  updateComplete: Promise<unknown>;
}

interface ShadowHost extends Updatable {
  shadowRoot: ShadowRoot | null;
}

/** The nth `<acp-rail-track>` under `root`. Throws on a miss. */
export function railEl(root: Root, i = 0): HTMLElement {
  const rails = root.querySelectorAll('acp-rail-track');
  const el = rails[i];
  if (!el) {
    throw new Error(`railEl: no <acp-rail-track> at index ${i} (found ${rails.length})`);
  }
  return el as HTMLElement;
}

/** The nth `<acp-rail-track>`'s own shadow root — the second hop, for anything
 *  that used to be captured as `.track` / `.fill` / `.marker` / `.pos-*`.
 *  Throws on a miss, and on a rail that has not rendered yet. */
export function railRoot(root: Root, i = 0): ShadowRoot {
  const el = railEl(root, i);
  if (!el.shadowRoot) {
    throw new Error(`railRoot: <acp-rail-track> at index ${i} has not rendered a shadow root`);
  }
  return el.shadowRoot;
}

/**
 * Settle a host and every rail inside it.
 *
 * A drag round-trips: the element dispatches `acp-rail-preview`, the host
 * stores it and recomputes its chrome, and the updated drawn props land back on
 * the rail. That is host → rail → host, and awaiting only the host leaves the
 * rail one update cycle behind whatever the assertion is about.
 */
export async function railSettled(host: ShadowHost): Promise<void> {
  await host.updateComplete;
  const rails = Array.from(host.shadowRoot?.querySelectorAll('acp-rail-track') ?? []);
  await Promise.all(rails.map((r) => (r as unknown as Updatable).updateComplete));
  await host.updateComplete;
}
