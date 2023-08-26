import { ApiError, HttpVerb } from './apiTypes';

const PORT = '3000';
const IP = 'localhost';
const URL = `http://${IP}:${PORT}`;

/**
 * Fetch some data from the backend
 *
 * @param method Type of request
 * @param route route to request to
 * @param token auth token
 * @param bodyParams request body or params
 *
 * @returns promise of the resolved data.
 */
export async function apiFetch(
  method: HttpVerb,
  route: string,
  bodyParams?: object,
): Promise<object> {
  function removeNull(obj: object): object {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, value]) => value != null)
        .map(([key, value]) => [
          key,
          value === Object(value) ? removeNull(value) : value,
        ]),
    );
  }
  if (bodyParams === undefined) {
    bodyParams = {};
  } else {
    bodyParams = removeNull(bodyParams);
  }

  const headers = new Headers({ 'Content-Type': 'application/json' });

  // Process body/param args
  let url: string;
  let body: string | null; // JSON string

  if (['POST', 'PUT'].includes(method)) {
    // POST and PUT use a body
    url = `${URL}${route}`;
    body = JSON.stringify(bodyParams);
  } else {
    // GET and DELETE use params
    url =
      `${URL}${route}?` +
      new URLSearchParams(bodyParams as Record<string, string>);
    body = null;
  }

  // Now send the request
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      body,
      headers,
    });
  } catch (err: unknown) {
    // Likely a network issue
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown request error ${err}`);
    }
  }

  // Decode the error
  let json: object;
  try {
    json = await res.json();
  } catch (err: unknown) {
    // JSON parse error
    if (err instanceof Error) {
      throw new ApiError(null, err.message);
    } else {
      throw new ApiError(null, `Unknown JSON error ${err}`);
    }
  }

  if ([400, 401, 403].includes(res.status)) {
    // Expect these defined errors to have messages
    const errorMessage = (json as { error: string | object }).error;
    throw new ApiError(res.status, errorMessage);
  }
  if (![200, 304].includes(res.status)) {
    // Unknown error
    throw new ApiError(res.status, `Request got status code ${res.status}`);
  }

  // Got valid data
  return Object.assign({}, json);
}
