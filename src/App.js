import Blits from '@lightningjs/blits'

import SplashScreen from './pages/SplashScreen'
import Login from './pages/Login'
import Subscriptions from './pages/Subscriptions'
import Channel from './pages/Channel'
import Details from './pages/Details'
import Player from './pages/Player'

const queryString = new URLSearchParams(window.location.search)
const showFPS = !!queryString.get('fps')

export default Blits.Application({
  template: `
    <Element w="1920" h="1080" :color="$backgroundColor">
      <RouterView />
      <FPScounter x="1610" :show="$showFPS" />
    </Element>
  `,
  state() {
    return {
      backgroundColor: '#18181b',
      showFPS: showFPS,
    }
  },
  routes: [
    {
      path: '/',
      component: SplashScreen,
    },
    {
      path: '/login',
      component: Login,
      hooks: {
        before(to) {
          // If already logged in, redirect to subscriptions list
          if (this.$appState.loggedIn) {
            return '/subscriptions'
          }
          return to
        },
      },
    },
    {
      path: '/subscriptions',
      component: Subscriptions,
      hooks: {
        before(to) {
          // Redirect to splash screen if user not logged in
          if (!this.$appState.loggedIn) {
            return '/'
          }
          return to
        },
      },
    },
    {
      path: '/creator/:id',
      component: Channel,
      hooks: {
        before(to) {
          // Redirect to splash screen if user not logged in
          if (!this.$appState.loggedIn) {
            return '/'
          }
          return to
        },
      },
    },
    {
      path: '/channel/:id/:channelid',
      component: Channel,
      hooks: {
        before(to) {
          // Redirect to splash screen if user not logged in
          if (!this.$appState.loggedIn) {
            return '/'
          }
          return to
        },
      },
    },
    {
      path: '/details/:id',
      component: Details,
      hooks: {
        before(to) {
          // Redirect to splash screen if user not logged in
          if (!this.$appState.loggedIn) {
            return '/'
          }
          return to
        },
      },
    },
    {
      path: '/player/:id',
      component: Player,
      hooks: {
        before(to) {
          // Redirect to splash screen if user not logged in
          if (!this.$appState.loggedIn) {
            return '/'
          }
          return to
        },
      },
    },
  ],
  hooks: {
    ready() {
      // Check for show FPS environment variable
      if (import.meta.env.VITE_FPS !== undefined && import.meta.env.VITE_FPS === true) {
        this.showFPS = true
      }

      // Handle background colour
      this.$listen('changeBackground', (color) => {
        this.backgroundColor = color ? color : '#18181b'
      })
      this.$listen('clearBackground', () => {
        this.backgroundColor = 'transparent'
      })
    },
  },
  input: {
    escape() {
      this.quit()
    },
    back() {
      this.$router.to('/')
    },
  },
})
