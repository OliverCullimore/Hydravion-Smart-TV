import Blits from '@lightningjs/blits'
import { appState } from '@lightningjs/blits/plugins'
import keymapping from './keymapping'
import App from './App'

// Use the Blits App State plugin
Blits.Plugin(appState, {
  loggedIn: false,
  user: {
    id: null,
    username: null,
  },
})

Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  debugLevel: 1,
  keymap: { ...keymapping() },
  fonts: [
    {
      family: 'lato',
      type: 'msdf',
      file: 'fonts/Lato-Regular.ttf',
    },
    {
      family: 'raleway',
      type: 'msdf',
      file: 'fonts/Raleway-ExtraBold.ttf',
    },
    {
      family: 'opensans',
      type: 'web',
      file: 'fonts/OpenSans-Medium.ttf',
    },
  ],
})
