import Blits from '@lightningjs/blits'

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
    ready() {
      // Redirect to subscriptions list after 4 seconds
      this.$setTimeout(() => {
        this.$router.to('/subscriptions')
      }, 4000)
    },
  },
})
