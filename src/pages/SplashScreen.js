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
      // Use get subscriptions to check if user is logged in
      let subscriptions = await Floatplane.getSubscriptions()
      if (subscriptions.length) {
        // Update logged in state
        this.$appState.loggedIn = true
        // Redirect to subscriptions list
        this.$router.to('/subscriptions', { data: subscriptions })
      } else {
        this.$router.to('/login')
      }
    },
  },
})
