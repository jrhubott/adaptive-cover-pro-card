import { beforeEach } from 'vitest';
import { _resetRegistryStore } from '../src/lib/registry-store';

// The registry store and the localStorage-backed registry cache are process-wide on
// purpose (they dedupe fetches and warm-start across cards). In tests that shared state
// would leak a registry from one case into the next, so reset both before every test.
beforeEach(() => {
  _resetRegistryStore();
  try {
    localStorage.clear();
  } catch {
    /* localStorage unavailable — nothing to clear */
  }
});
