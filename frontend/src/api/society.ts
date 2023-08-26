import { apiFetch } from './utils/fetch';
import {
  ApplicationInfo,
  Empty,
  Society,
  Events,
  SocietyListInfo,
  SocietyMemberListInfo,
  TokenType,
} from './utils/interfaces';

const BASE_URL = '/society';

/**
 * Creates an application for a society. Returns a new applicationId.
 *
 * Errors:
 * - [401] token is invalid
 * - [400] societyName is invalid
 * - [400] description is invalid
 *
 */
export function apply(
  token: TokenType,
  societyName: string,
  description: string,
  tags: string[],
): Promise<ApplicationInfo> {
  return apiFetch('POST', BASE_URL + '/apply', {
    token,
    societyName,
    description,
    tags,
  }) as Promise<ApplicationInfo>;
}

/**
 * Edits the page of a society given the societyId.
 *
 * Errors:
 * - [401] token is invalid
 * - [403] user is not a site or society admin
 * - [400] societyId does not refer to existing society
 * - [400] societyName is invalid
 * - [400] description is invalid
 * TODO: Other fields iter 2/3 are invalid
 *
 */
export function edit(
  token: TokenType,
  societyId: number,
  societyName: string,
  description: string,
): Promise<Empty> {
  return apiFetch('PUT', BASE_URL + '/edit', {
    token,
    societyId,
    societyName,
    description,
  }) as Promise<Empty>;
}

/**
 * Displays information about a society.
 *
 * Errors:
 * - [400] societyId does not refer to existing society
 */
export function view(societyId: number): Promise<Society> {
  return apiFetch('GET', BASE_URL + '/view', {
    societyId,
  }) as Promise<Society>;
}

/**
 * Returns a list of societies that match the optional parameters given
 *
 * If no parameters are given: Return every society in the DB
 * If searchString is given: Return societies whose name/description match the substr
 * If paginationStart & paginationEnd is given: Return societies between those numbers
 *    - (Original ordering by society name, ascending)
 *    - Both paginationStart & paginationEnd must be provided together.
 */
export function list(
  searchString?: string,
  paginationStart?: number,
  paginationEnd?: number,
): Promise<SocietyListInfo> {
  return apiFetch('GET', BASE_URL + '/list', {
    searchString,
    paginationStart,
    paginationEnd,
  }) as Promise<SocietyListInfo>;
}

/**
 * Become a member of a society.
 *
 * Errors:
 * - [401] token is invalid
 * - [400] societyId is invalid
 */
export function join(token: TokenType, societyId: number): Promise<Empty> {
  return apiFetch('POST', BASE_URL + '/join', {
    token,
    societyId,
  }) as Promise<Empty>;
}

/**
 * List all the members of a particular society.
 *
 * Role Permissions:
 * 1 = Society Admin
 * 2 = Society Moderator
 * 3 = Society Member
 *
 * Errors:
 * - [400] societyId is invalid
 */
export function members(societyId: number): Promise<SocietyMemberListInfo> {
  return apiFetch('GET', BASE_URL + '/members', {
    societyId,
  }) as Promise<SocietyMemberListInfo>;
}

/**
 * A siteAdmin can delete a society.
 *
 * Errors:
 * - [401] Invalid token
 * - [400] Invalid societyId
 * - [403] Insufficient permissions
 */
export function remove(token: string, societyId: number): Promise<Empty> {
  return apiFetch('DELETE', BASE_URL, {
    token,
    societyId,
  }) as Promise<Empty>;
}

/**
 * List all the events of a particular society that haven't occured yet.
 *
 * Errors:
 * - [400] societyId is invalid
 */
export function events(societyId: number): Promise<Events> {
  return apiFetch('GET', BASE_URL + '/events', {
    societyId,
  }) as Promise<Events>;
}
