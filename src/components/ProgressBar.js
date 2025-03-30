import Blits from '@lightningjs/blits'

export default Blits.Component('ProgressBar', {
  template: `
    <Element w="$width" h="6" color="#26272b" :effects="[{type: 'radius', props: {radius: $radius}}]">
      <Element :w.transition="$progress" h="6" color="#0085ff" :effects="[{type: 'radius', props: {radius: $radius}}]" />
    </Element>
  `,
  props: [
    'width',
    {
      key: 'progress',
      cast(v) {
        return v + '%'
      },
    },
  ],
  state() {
    return {
      radius: 3,
    }
  },
})
