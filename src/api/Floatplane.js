/* Floatplane API Client */

/**
 * Make an API call (vite proxy for dev, JS service for webOS).
 * @param {string} [endpoint] - API endpoint
 * @param {object} [request] - Request parameters
 * @returns {Promise}
 */
const apiFetch = async (endpoint, request) => {
  const response = await fetch(endpoint ?? '', request)
  console.log(response)
  return response
}

/**
 * Login to the API.
 * @param {string} [username] - Username or email
 * @param {string} [password] - Password
 * @returns {Promise}
 */
const login = async (username, password) => {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: `${username}`,
      password: `${password}`,
    }),
  }
  const response = await apiFetch('/api/v2/auth/login', request)
  return await response.json()
}

/**
 * Submit 2FA code to the API.
 * @param {string} [token] - The 2FA token
 * @returns {Promise}
 */
const login2fa = async (token) => {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: `${token}`,
    }),
  }
  const response = await apiFetch('/api/v3/auth/checkFor2faLogin', request)
  return await response.json()
}

/**
 * Logout from API.
 * @returns {Promise}
 */
const logout = async () => {
  const request = {
    method: 'POST',
  }
  const response = await apiFetch('/api/v3/auth/logout', request)
  return await response.json()
}

/**
 * Get all channel subscriptions.
 * @returns {Promise}
 */
const getSubscriptions = async () => {
  const response = await apiFetch('/api/v3/user/subscriptions')
  return await response.json()
}

export default {
  login,
  login2fa,
  logout,
  getSubscriptions,
}
