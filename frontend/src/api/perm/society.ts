import { apiFetch } from '../utils/fetch';
import { Empty, TokenType } from '../utils/interfaces';

const BASE_URL = '/perm/society';

/**
 * Grants the userId the permLevel for the societyId.
 *
 * Society Permissions:
 * 1 = Society Admin
 * 2 = Society Moderator
 * 3 = Society Member
 *
 * Errors:
 * - [401] token is invalid
 * - [400] userId is invalid
 * - [400] societyId is invalid
 * - [400] permLevel is invalid
 * - [400] userId is not a member of the society
 * - [403] token user is not a member of the society
 * - [403] token user does not have permissions over the other user
 * - [403] token user does not have permissions to promote to that permLevel
 */
export function allocate(
  token: TokenType,
  userId: number,
  societyId: number,
  permLevel: number,
): Promise<Empty> {
  return apiFetch('POST', BASE_URL + '/allocate', {
    token,
    userId,
    societyId,
    permLevel,
  }) as Promise<Empty>;
}
