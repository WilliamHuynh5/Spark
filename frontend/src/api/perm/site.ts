import { apiFetch } from '../utils/fetch';
import { Empty, TokenType } from '../utils/interfaces';

const BASE_URL = '/perm/site';

/**
 * Grants the userId the permLevel for the site.
 *
 * Site Permissions:
 * 1 = Site Admin
 * 2 = Site Member
 *
 * Errors:
 * - [401] token is invalid
 * - [400] userId is invalid
 * - [400] permission is invalid
 * - [403] token user is not a site admin
 */
export function allocate(
  token: TokenType,
  userId: number,
  permLevel: number,
): Promise<Empty> {
  return apiFetch('POST', BASE_URL + '/allocate', {
    token,
    userId,
    permLevel,
  }) as Promise<Empty>;
}
