import { apiFetch } from './utils/fetch';
import { Empty } from './utils/interfaces';

// Can just import this function to clear db
export function clear(): Promise<Empty> {
  return apiFetch('DELETE', '/clear', {}) as Promise<Empty>;
}
