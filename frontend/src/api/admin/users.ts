import { apiFetch } from '../utils/fetch';
import { TokenType, UserListInfo } from '../utils/interfaces';

const BASE_URL = '/admin/users';

/**
 * List all users in the system.
 *
 * Errors:
 *  - [400] token does not exist
 *  - [403] token user is not a site admin
 */
export default function users(token: TokenType): Promise<UserListInfo> {
  return apiFetch('GET', BASE_URL, {
    token,
  }) as Promise<UserListInfo>;
}
