import { apiFetch } from '../utils/fetch';
import {
  ApplicationsListInfo,
  Empty,
  SocietyInfo,
  TokenType,
} from '../utils/interfaces';

const BASE_URL = '/admin/application';

/**
 * List the most recent society applications created, regardless if they’re pending, approved, or denied.
 *
 * Application Status:
 * - 1 = Pending
 * - 2 = Approved
 * - 3 = Denied
 *
 * Errors:
 * - [401] token is invalid
 * - [403] token user is not a site admin
 * TODO: waiting for backend confirmation
 */
export function list(token: TokenType): Promise<ApplicationsListInfo> {
  return apiFetch('GET', BASE_URL + '/list', {
    token,
  }) as Promise<ApplicationsListInfo>;
}

/**
 * Approves the applicationId and creates and returns a new societyId.
 *
 * Errors:
 * - [401] token is invalid
 * - [400] applicationId is invalid
 * - [403] token user is not a site admin
 */
export function approve(
  token: TokenType,
  applicationId: number,
): Promise<SocietyInfo> {
  return apiFetch('PUT', BASE_URL + '/approve', {
    token,
    applicationId,
  }) as Promise<SocietyInfo>;
}

/**
 * Denies the application related to applicationId.
 *
 * Errors:
 * - [400] token is invalid
 * - [400] applicationId is invalid
 * - [403] token user is not a site admin
 */
export function deny(token: TokenType, applicationId: number): Promise<Empty> {
  return apiFetch('PUT', BASE_URL + '/deny', {
    token,
    applicationId,
  }) as Promise<Empty>;
}
