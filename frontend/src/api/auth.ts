import { apiFetch } from './utils/fetch';
import { Empty, TokenInfo, TokenType } from './utils/interfaces';

const BASE_URL = '/auth';

/**
 * Register a user with the relevant details and return a token.
 *
 * Errors:
 * - [400] email is invalid
 * - [400] password is weak
 * - [400] nameFirst is invalid
 * - [400] nameLast is invalid
 * - [400] zId is invalid
 */
export function register(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string,
  zId: string,
): Promise<TokenInfo> {
  return apiFetch('POST', BASE_URL + '/register', {
    email,
    password,
    nameFirst,
    nameLast,
    zId,
  }) as Promise<TokenInfo>;
}

/**
 * Login a user given an email and password and return a token.
 *
 * Errors:
 * - [400] email doesn’t exist
 * - [400] password is incorrect
 */
export function login(email: string, password: string): Promise<TokenInfo> {
  return apiFetch('POST', BASE_URL + '/login', {
    email,
    password,
  }) as Promise<TokenInfo>;
}

/**
 * Logout a user session, given their token.
 *
 * Errors:
 *  - [400] token does not exist
 */
export function logout(token: TokenType): Promise<Empty> {
  return apiFetch('PUT', BASE_URL + '/logout', {
    token,
  }) as Promise<Empty>;
}

/**
 * Request a password reset code to be sent to the specified email.
 *
 * Errors:
 *  - [400] Invalid email format
 */
export function getCode(email: string): Promise<Empty> {
  return apiFetch('GET', BASE_URL + '/reset', {
    email,
  }) as Promise<Empty>;
}

/**
 * Use a reset code to reset a password.
 *
 * Errors:
 *  - [400] Incorrect code
 *  - [400] Invalid password
 */
export function postCode(code: string, password: string): Promise<Empty> {
  return apiFetch('POST', BASE_URL + '/reset', {
    code,
    password,
  }) as Promise<Empty>;
}
