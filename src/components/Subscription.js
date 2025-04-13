import Blits from '@lightningjs/blits'

export default Blits.Component('Subscription', {
  template: `
    <Element w="$width" h="$height" mount="0.5" :scale="$hasFocus ? 1.3 : 1">
      <Element
        src="$logo.path"
        w="$width"
        h="$width"
        :color="$bgColor"
        :effects="[{type: 'radius', props: {radius: $width}}]"
        @loaded="$imageLoaded"
      />
      <Text
        content="$title"
        color="#fff"
        size="20"
        align="center"
        mount="{x: 0.5}"
        :x="$width/2"
        :y="$width + 35"
        maxwidth="$width"
      />
    </Element>
  `,
  props: ['width', 'height', 'logo', 'title'],
  state() {
    return {
      bgColor: "{top: '#ee7752', bottom: '#e73c7e', left: '#23a6d5', right: '#23d5ab'}",
    }
  },
  methods: {
    imageLoaded() {
      this.bgColor = ''
    },
  },
})
