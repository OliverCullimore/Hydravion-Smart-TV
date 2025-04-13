/* Floatplane API Client */
import p from '../../package.json'

/**
 * Make an API call (vite proxy for dev, JS service for webOS).
 * @param {string} [endpoint] - API endpoint
 * @param {object} [request] - Request parameters
 * @returns {Promise}
 */
const apiFetch = async (endpoint, request) => {
  // Set extra headers
  request = Object.assign(
    {
      headers: {
        'User-Agent': `Hydravion Smart TV App v${p.version}, CFNetwork`,
        Origin: 'https://www.floatplane.com',
      },
    },
    request || {}
  )
  // Set URL
  let url = endpoint ?? ''
  if (import.meta.env.VITE_PLATFORM !== undefined) {
    url = 'https://www.floatplane.com' + url
  }
  const response = await fetch(url, request)
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
 * Get logged in user info.
 * @returns {Promise}
 */
const getUserInfo = async () => {
  const response = await apiFetch('/api/v3/user/self')
  return await response.json()
}

/**
 * Get active channel subscriptions.
 * @returns {Promise}
 */
const getSubscriptions = async () => {
  const response = await apiFetch('/api/v3/user/subscriptions?active=true')
  return await response.json()
}

/**
 * Get creators info.
 * @param {array} [ids] - Creator GUIDs
 * @returns {Promise}
 */
const getCreatorsInfo = async (ids) => {
  const params = new URLSearchParams(ids?.map((id) => ['ids', id]))
  const response = await apiFetch('/api/v3/creator/list?' + params)
  return await response.json()
}

/**
 * Get creator blog posts.
 * @param {string} [id] - Creator GUID
 * @param {string} [channel] - Creator sub channel
 * @param {number} [limit] - Number of posts to return
 * @param {number} [page] - Page number of posts to return
 * @param {string} [search] - Search filter
 * @param {array} [tags] - Search tags filter
 * @param {string} [sort] - Sort order: DESC, ASC
 * @returns {Promise}
 */
const getCreatorBlogPosts = async (id, channel, limit, page, search, tags, sort) => {
  let paramsArray = { id: `${id}` }
  if (channel !== undefined && channel !== '') {
    paramsArray['channel'] = `${channel}`
  }
  if (limit !== undefined && limit > 0) {
    paramsArray['limit'] = `${limit}`
    if (page !== undefined && page > 0) {
      paramsArray['fetchAfter'] = `${limit * page}`
    }
  }
  if (search !== undefined && search !== '') {
    paramsArray['search'] = `${search}`
  }
  if (tags !== undefined && tags.length > 0) {
    paramsArray['tags'] = tags
  }
  if (sort !== undefined && sort !== '') {
    paramsArray['sort'] = `${sort}`
  }
  const response = await apiFetch('/api/v3/content/creator?' + new URLSearchParams(paramsArray))
  return await response.json()
}

/**
 * Get post info.
 * @param {string} [id] - Post GUID
 * @returns {Promise}
 */
const getPostInfo = async (id) => {
  const response = await apiFetch('/api/v3/content/post?' + new URLSearchParams({ id: `${id}` }))
  return await response.json()
}

/**
 * Get video info.
 * @param {string} [id] - Video GUID
 * @returns {Promise}
 */
const getVideoInfo = async (id) => {
  const response = await apiFetch('/api/v3/content/video?' + new URLSearchParams({ id: `${id}` }))
  return await response.json()
}

/**
 * Get delivery info.
 * @param {string} [type] - Content type: VOD, AOD, Live, Download
 * @param {string} [guid] - Content GUID (pass this or the creator)
 * @param {string} [creator] - Content creator (used for live content type)
 * @returns {Promise}
 */
const getDeliveryInfo = async (type, guid, creator) => {
  const request = {
    type: `${type}`,
  }
  if (guid) {
    request['guid'] = `${guid}`
  }
  if (creator) {
    request['creator'] = `${creator}`
  }
  const response = await apiFetch('/api/v2/cdn/delivery?' + new URLSearchParams(request))
  return await response.json()
}

/**
 * Get video(s) progress.
 * @param {array} [ids] - Video GUIDs
 * @param {string} [type] - Content type: blogPost
 * @returns {Promise}
 */
const getVideosProgressPercentage = async (ids, type) => {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: `${ids}`,
      contentType: `${type}`,
    }),
  }
  const response = await apiFetch('/api/v3/content/get/progress', request)
  return await response.json()
}

/**
 * Get image path of closest to target image size.
 * @param {object} [images] - Image/icon object
 * @param {number} [targetWidth] - Closest to target width
 * @returns {Array}
 */
const getTargetImageSize = (images, targetWidth) => {
  // Check for a valid image object
  if (typeof images !== 'object' && images !== null) {
    return Array()
  }

  // Flatten images into a single object
  if (images['childImages'] !== undefined) {
    images = [images, ...images['childImages']]
  }

  // Find the image closest to the target width
  const closestImage = images.reduce((closest, current) => {
    targetWidth = targetWidth ?? 0
    return Math.abs(current.width - targetWidth) < Math.abs(closest.width - targetWidth)
      ? current
      : closest
  })

  // Proxy image
  closestImage['path'] = (closestImage['path'] ?? '').replace('https://pbs.floatplane.com', '')

  return closestImage
}

export default {
  login,
  login2fa,
  logout,
  getUserInfo,
  getSubscriptions,
  getCreatorsInfo,
  getCreatorBlogPosts,
  getPostInfo,
  getVideoInfo,
  getDeliveryInfo,
  getVideosProgressPercentage,
  getTargetImageSize,
}
