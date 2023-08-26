import { apiFetch } from './utils/fetch';
import {
  AttendingStatus,
  Empty,
  Event,
  EventInfo,
  Events,
  TokenType,
} from './utils/interfaces';

const BASE_URL = '/event';

/**
 * Creates an event
 *
 * Errors:
 *  - [401] Invalid token
 *  - [400] Invalid societyId
 *  - [403] User does not have permission
 */
export function create(
  token: TokenType,
  societyId: number,
  name: string,
  description: string,
  time: string, // util.format(Date())
  location: string,
): Promise<EventInfo> {
  return apiFetch('POST', BASE_URL, {
    token,
    societyId,
    name,
    description,
    time,
    location,
  }) as Promise<EventInfo>;
}

/**
 * Edits an event
 *
 * Errors:
 *  - [401] Invalid token
 *  - [400] Invalid eventId
 *  - [403] User does not have permission
 */
export function edit(
  token: TokenType,
  eventId: number,
  name: string,
  description: string,
  time: string, // util.format(Date())
  location: string,
): Promise<Empty> {
  return apiFetch('PUT', BASE_URL + '/edit', {
    token,
    eventId,
    name,
    description,
    time,
    location,
  }) as Promise<Empty>;
}

export function get(eventId: number): Promise<Event> {
  return apiFetch('GET', BASE_URL, { eventId }) as Promise<Event>;
}

/**
 * A user attends an event
 *
 * Errors:
 *  - [401] Invalid token
 *  - [400] Invalid eventId
 */
export function attend(token: string, eventId: number): Promise<Empty> {
  return apiFetch('PUT', BASE_URL + '/attend', {
    token,
    eventId,
  }) as Promise<Empty>;
}

/**
 * A user unattends an event
 *
 * Errors:
 *  - [401] Invalid token
 *  - [400] Invalid eventId
 *  - [400] User is not attending
 */
export function unattend(token: string, eventId: number): Promise<Empty> {
  return apiFetch('DELETE', BASE_URL + '/attend', {
    token,
    eventId,
  }) as Promise<Empty>;
}

/**
 * See if a user is attending an event
 *
 * Errors:
 *  - [401] Invalid token
 *  - [400] Invalid eventId
 */
export function status(
  token: string,
  eventId: number,
): Promise<AttendingStatus> {
  return apiFetch('GET', BASE_URL + '/status', {
    token,
    eventId,
  }) as Promise<AttendingStatus>;
}

/**
 * Deletes an event
 *
 * Errors:
 *  - [401] Invalid token
 *  - [400] Invalid eventId
 *  - [403] Insufficient permissions
 */
export function remove(token: TokenType, eventId: number): Promise<Empty> {
  return apiFetch('DELETE', BASE_URL, {
    token,
    eventId,
  }) as Promise<Empty>;
}

/**
 * Fills the event form with an entry
 *
 * Errors:
 *  - [400] Invalid eventId
 *  - [400] Invalid email (format OR duplicate)
 *  - [400] Invalid zId (duplicate)
 */
export function form(
  eventId: number,
  nameFirst: string,
  nameLast: string,
  zId: string,
  email: string,
): Promise<Empty> {
  return apiFetch('POST', BASE_URL + '/form', {
    eventId,
    nameFirst,
    nameLast,
    zId,
    email,
  }) as Promise<Empty>;
}

/**
 * Returns a list of events that match the optional parameters given
 *
 * If no parameters are given: Return every event in the DB
 * If searchString is given: Return events whose name/description/location match the substr
 * If timeStart is given: Return events after timeStart
 * If timeEnd is given: Return events before timeStart
 *    - Both timeStart & timeEnd can be given together: Returns events that lie between the two time ranges
 * If paginationStart & paginationEnd is given: Return events between those numbers
 *    - (Original ordering by event time, ascending)
 *    - Both paginationStart & paginationEnd must be provided together.
 */
export function list(
  searchString?: string,
  timeStart?: string,
  timeEnd?: string,
  paginationStart?: number,
  paginationEnd?: number,
): Promise<Events> {
  return apiFetch('GET', BASE_URL + '/list', {
    searchString,
    timeStart,
    timeEnd,
    paginationStart,
    paginationEnd,
  }) as Promise<Events>;
}

export function generateCSV(
  token: TokenType,
  eventId: number,
): Promise<Record<string, never>> {
  return apiFetch('POST', BASE_URL + '/generateCSV', {
    token,
    eventId,
  }) as Promise<Record<string, never>>;
}
