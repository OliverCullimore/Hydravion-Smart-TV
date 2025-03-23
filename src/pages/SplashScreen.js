import Blits from '@lightningjs/blits'

import Floatplane from '../api/Floatplane'
import Loader from '../components/Loader'

export default Blits.Component('SplashScreen', {
  components: {
    Loader,
  },
  template: `
    <Element w="1920" h="1080" src="assets/splashBackground.png">
      <Loader :x="1920 / 2" mount="{x: 0.5}" y="750" w="160" :alpha.transition="$loaderAlpha" />
    </Element>
  `,
  state() {
    return {
      /**
       * Alpha of the loader component, used to create a fade-in / fade-out transition
       * @type {number}
       */
      loaderAlpha: 1,
    }
  },
  hooks: {
    async ready() {
      // Get logged in user info
      let userInfo = await Floatplane.getUserInfo()
      if (userInfo.length && userInfo['id'] !== undefined) {
        // Update logged in user
        this.$appState.loggedIn = true
        this.$appState.user.id = userInfo['id']
        this.$appState.user.username = userInfo['username']
        // Redirect to subscriptions list
        this.$router.to('/subscriptions', { data: subscriptions })
      } else {
        this.$router.to('/login')
      }
    },
  },
})
