import { apiFetch } from './utils/fetch';
import {
  Profile,
  ProfileEvents,
  ProfileSocieties,
  TokenType,
} from './utils/interfaces';

const BASE_URL = '/profile';

/**
 * Displays information about the user; name, email, zId.
 * As well as clubs joined, and events attending.
 *
 * Errors:
 *  - [401] token does not exist
 */
export function view(token: TokenType): Promise<Profile> {
  return apiFetch('GET', BASE_URL + '/view', {
    token,
  }) as Promise<Profile>;
}

/**
 * Edits information about the user; name & email.
 *
 * Errors:
 *  - [401] token does not exist
 *  - [400] invalid email
 */
export function edit(
  token: TokenType,
  email: string,
  nameFirst: string,
  nameLast: string,
): Promise<Profile> {
  return apiFetch('PUT', BASE_URL + '/edit', {
    token,
    email,
    nameFirst,
    nameLast,
  }) as Promise<Profile>;
}

/**
 * Retrieves events for a user.
 *
 * Errors:
 *  - [401] token does not exist
 */
export function events(token: TokenType): Promise<ProfileEvents> {
  return apiFetch('GET', BASE_URL + '/events', {
    token,
  }) as Promise<ProfileEvents>;
}

/**
 * Retrieves societies for a user.
 *
 * Errors:
 *  - [401] token does not exist
 */
export function societies(token: TokenType): Promise<ProfileSocieties> {
  return apiFetch('GET', BASE_URL + '/societies', {
    token,
  }) as Promise<ProfileSocieties>;
}
