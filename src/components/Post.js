import Blits from '@lightningjs/blits'
import ProgressBar from './ProgressBar'

export default Blits.Component('Post', {
  components: {
    ProgressBar,
  },
  template: `
    <Element w="$width" h="$height">
      <Element>
        <Element
          src="$thumbnail.path"
          w="$width"
          h="$height/3*2.1"
          :color="$bgColor"
          :effects="[{type: 'radius', props: {radius: 16}}]"
          @loaded="$imageLoaded"
        />
        <ProgressBar width="$width" progress="$progress" y="$height/3*2.1-6" />
        <Text
          content="$title"
          :color="$hasFocus ? '#0085ff' : '#fff'"
          size="20"
          maxwidth="$width-30"
          maxlines="2"
          y="$height/3*2.1+10"
        />
        <Text
          content="$type"
          :color="$hasFocus ? '#0085ff' : '#fff'"
          size="18"
          maxwidth="$width/2-15"
          maxlines="1"
          y="$height-20"
        />
        <Text
          content="$duration"
          :color="$hasFocus ? '#0085ff' : '#fff'"
          size="18"
          maxlines="1"
          x="$width"
          y="$height-20"
          mount="{x:1}"
        />
      </Element>
    </Element>
  `,
  props: ['width', 'height', 'thumbnail', 'title', 'type', 'duration', 'progress'],
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
