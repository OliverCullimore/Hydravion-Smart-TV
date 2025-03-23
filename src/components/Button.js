import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  template: `
    <Element w="$width" h="$height" :color="$backgroundColor" :effects="[{type: 'radius', props: {radius: $radius}}]">
      <Text :content="$buttonText" color="#fff" lineheight="$height" size="$fontSize" :x="$x" :mount="{x: $mountX}" />
    </Element>
  `,
  props: ['buttonText', 'textAlign'],
  state() {
    return {
      backgroundColor: '#0085ff',
      borderWidth: 2,
      fontSize: 21,
      height: 60,
      radius: 6,
      width: 400,
    }
  },
  computed: {
    mountX() {
      return this.textAlign === 'right' ? 1 : this.textAlign === 'center' ? 0.5 : 0
    },
    x() {
      return this.textAlign === 'right'
        ? this.width - 20
        : this.textAlign === 'center'
          ? this.width / 2
          : 20
    },
  },
  hooks: {
    focus() {
      this.backgroundColor = '#0061bb'
    },
    unfocus() {
      this.backgroundColor = '#0085ff'
    },
  },
})
