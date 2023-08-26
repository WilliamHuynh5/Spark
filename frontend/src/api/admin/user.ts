import { apiFetch } from '../utils/fetch';
import { Empty, TokenType } from '../utils/interfaces';

const BASE_URL = '/admin/user';

/**
 * Removes a user from the system
 *
 * Errors:
 *  - [401] Invalid token
 *  - [400] Invalid userId
 *  - [403] Insufficient permissions
 */
export function remove(token: TokenType, userId: number): Promise<Empty> {
  return apiFetch('DELETE', BASE_URL + '/remove', {
    token,
    userId,
  }) as Promise<Empty>;
}
