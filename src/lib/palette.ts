export const PALETTE: readonly string[] = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#17becf',
  '#e377c2',
];

export function colorForIndex(i: number): string {
  const n = PALETTE.length;
  return PALETTE[((i % n) + n) % n];
}

export interface ResolvedColor {
  color: string;
  isOverride: boolean;
}

export function resolveCoverColor(
  override: string | null | undefined,
  index: number,
): ResolvedColor {
  if (typeof override === 'string' && override.length > 0) {
    return { color: override, isOverride: true };
  }
  return { color: colorForIndex(index), isOverride: false };
}
