/**
 * Functions to facilitate interaction with the backend routes
 */

import * as fetch from './utils/fetch';
import * as adminRequests from './admin';
import * as permRequests from './perm';
import * as authRequests from './auth';
import * as societyRequests from './society';
import * as profileRequests from './profile';
import * as eventRequests from './event';

export const admin = adminRequests;
export const perm = permRequests;
export const auth = authRequests;
export const society = societyRequests;
export const profile = profileRequests;
export const event = eventRequests;
export const apiFetch = fetch.apiFetch;

export default {
  admin,
  perm,
  auth,
  society,
  profile,
  event,
  apiFetch,
};
