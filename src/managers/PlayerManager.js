import shaka from 'shaka-player'

let player
let videoElement

const state = {
  playingState: false,
}

/**
 * Initializes the player.
 * @param {HTMLElement} [element] - The video element used to initiate playback in.
 * @returns {Promise<void>}
 */
const init = async (element) => {
  shaka.polyfill.installAll() // polyfilling for devices that need it.

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (!shaka.Player.isBrowserSupported()) {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!')
  }

  videoElement = element

  if (!videoElement) {
    videoElement = document.createElement('video')

    videoElement.style.cssText = 'position: absolute; top: 0; left: 0; z-index: -1'

    videoElement.width = window.innerWidth
    videoElement.height = window.innerHeight

    player = new shaka.Player()
    await player.attach(videoElement)

    videoElement.autoplay = false

    // Manifest networking request filter (to send API URL through the CORS proxy)
    player.getNetworkingEngine().registerResponseFilter((type, response) => {
      if (type === shaka.net.NetworkingEngine.RequestType.MANIFEST) {
        // Get current manifest data
        let manifestText = shaka.util.StringUtils.fromUTF8(response.data)
        // Modify EXT-X-KEY line
        manifestText = manifestText.replace('https://www.floatplane.com', 'http://localhost:5173')
        // Return modified manifest data
        response.data = shaka.util.StringUtils.toUTF8(manifestText)
      }
    })

    // Listen for error events.
    player.addEventListener('error', (err) => {
      console.error(err)
    })
    document.body.insertBefore(videoElement, document.body.firstChild)
  }
}
/**
 * Loads the player.
 * @param {Object} config - The player configuration.
 * @returns {Promise<void>}
 */
const load = async (config) => {
  if (!player || !videoElement) {
    throw 'Player not initialized yet'
  }

  await player.load(config.streamUrl)
}

const play = () => {
  videoElement.play().then(() => {
    state.playingState = true
  })
}

const pause = () => {
  videoElement.pause()
  state.playingState = false
}

const destroy = async () => {
  await player.destroy()

  player = null
  videoElement.remove()
  videoElement = null
}

const getCurrentTime = () => {
  return videoElement.currentTime
}

const getVideoDuration = () => {
  return videoElement.duration
}

const getTimeFormat = () => {
  let secondsToMmSs = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5)
  return `${secondsToMmSs(videoElement.currentTime)} : ${secondsToMmSs(
    Math.floor(videoElement.duration)
  )}`
}

export default {
  init,
  load,
  play,
  pause,
  getCurrentTime,
  getVideoDuration,
  getTimeFormat,
  state,
  destroy,
}
