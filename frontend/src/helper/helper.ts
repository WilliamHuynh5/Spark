import { NavigateFunction } from 'react-router-dom';

/**
 * Local storage identified for user authenticated token.
 */
const TOKEN_ACCESS_KEY = 'token';

/**
 * Takes a time string as input and returns a formatted string representing the date and time in a human-readable format.
 *
 * @param {string} timeString - A valid time string representing a date and time. It should be in a format that can be parsed by the `Date` constructor.
 * @returns {string} - A formatted string representing the date and time in a pretty, human-readable format. The format of the output string will be "FormattedDate, FormattedTime".
 */
export function formatTimeToPrettyString(timeString: string): string {
  const date = new Date(timeString);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${formattedDate}, ${formattedTime}`;
}

/**
 * Retrieves the authenticated token from the localStorage and returns it as a string.
 * If the token is not found or is empty, it will navigate to the login page and return undefined.
 *
 * @returns {string} - The authenticated token if found in localStorage, or empty string if not found or empty.
 */
export function getAuthenticatedToken(): string {
  const getToken = localStorage.getItem(TOKEN_ACCESS_KEY);
  const authUserToken = getToken as string;

  if (!authUserToken) {
    return '';
  }

  return authUserToken;
}

/**
 * Set the authenticated token in local storage.
 *
 * @param token string token to set
 */
export function setAuthenticatedToken(token: string) {
  localStorage.setItem(TOKEN_ACCESS_KEY, token);
}

/**
 * Remove the authenticated token in local storage.
 */
export function removeAuthenticatedToken() {
  localStorage.removeItem(TOKEN_ACCESS_KEY);
}

/**
 * Checks whether a token represents a guest.
 *
 * @param token string to validate
 * @returns true if they are a guest, else false.
 */
export function isGuest(token: string) {
  return token === '' || token === null;
}

/**
 *
 * @param paramName string - The name of the parameter to retrieve from the URL.
 * @returns {string} - The value of the parameter if found in the URL, or empty string if not found or empty.
 */
export function getUrlParamsId(
  paramName: string | undefined,
  navigate: NavigateFunction,
): number {
  if (paramName === undefined) {
    navigate('/auth/login');
    return 0;
  }
  return parseInt(paramName);
}
