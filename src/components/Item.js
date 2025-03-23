import Blits from '@lightningjs/blits'

export default Blits.Component('Item', {
  template: `
    <Element
      w="$width"
      h="$height"
      :color="$hasFocus ? '#fff' : '#888'"
      :effects="[{type: 'radius', props: {radius: $radius}}]"
    >
      <Text content="$item.label" color="#121212" size="$height/2" mount="0.5" x="$width/2" y="$height/2" />
    </Element>
  `,
  props: ['item', 'width', 'height'],
  state() {
    return {
      radius: 6,
    }
  },
})
