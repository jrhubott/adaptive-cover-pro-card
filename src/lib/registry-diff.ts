import type { EntityRegistryEntry } from './entity-registry';

type Sig = string;

function sig(e: EntityRegistryEntry): Sig {
  return `${e.entity_id}|${e.unique_id}|${e.platform}|${e.config_entry_id ?? ''}`;
}

export function registryChanged(prev: EntityRegistryEntry[], next: EntityRegistryEntry[]): boolean {
  if (prev.length !== next.length) return true;
  const prevMap = new Map<string, Sig>(prev.map((e) => [e.entity_id, sig(e)]));
  for (const e of next) {
    if (prevMap.get(e.entity_id) !== sig(e)) return true;
  }
  return false;
}

export interface RegistryEventPayload {
  action: 'create' | 'update' | 'remove';
  entity_id: string;
  changes?: Record<string, unknown>;
}

export function isAcpRegistryEvent(
  payload: RegistryEventPayload,
  acpEntityIds: Set<string>,
): boolean {
  if (payload.action === 'create') return true;
  return acpEntityIds.has(payload.entity_id);
}

export function filterAcp(
  entries: EntityRegistryEntry[],
  entryId: string,
  platform?: string,
): EntityRegistryEntry[] {
  return entries.filter(
    (e) => e.config_entry_id === entryId && (platform === undefined || e.platform === platform),
  );
}
