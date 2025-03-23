import Blits from '@lightningjs/blits'

export default Blits.Component('Loader', {
  template: `
    <Element>
      <Circle size="40" color="#fff" :alpha.transition="{value: $alpha, delay: 200, easing: 'ease-in', duration: 300}" />
      <Circle
        size="40"
        color="#fff"
        x="60"
        :alpha.transition="{value: $alpha, delay: 300, easing: 'ease-in', duration: 300}"
      />
      <Circle
        size="40"
        color="#fff"
        x="120"
        :alpha.transition="{value: $alpha, delay: 400, easing: 'ease-in', duration: 300}"
      />
    </Element>
  `,
  state() {
    return {
      /**
       * Alpha of the circles, used to create a fade-in / fade-out transition
       */
      alpha: 0,
    }
  },
  hooks: {
    ready() {
      this.start()
    },
  },
  methods: {
    /**
     * Starts the loading transition in an interval
     * @returns {void}
     */
    start() {
      this.$setInterval(() => {
        this.alpha = this.alpha === 1 ? 0 : 1
      }, 800)
    },
  },
})
