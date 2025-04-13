import Blits from '@lightningjs/blits'

import Floatplane from '../api/Floatplane'
import Button from '../components/Button'

export default Blits.Component('Details', {
  components: {
    Button,
  },
  template: `
    <Element>
      <Element :src="$cover.path" color="rgba(255, 255, 255, 0.12)" w="1920" h="1080" />
      <Text :content="$title" size="80" align="center" maxwidth="1780" x="70" y="70" />
      <Button ref="playbutton" x="70" y="410" buttonText="Play" textAlign="center" />
    </Element>
  `,
  props: ['id', 'postData'],
  state() {
    return {
      post: Array(),
      title: '',
      cover: Array(),
    }
  },
  hooks: {
    ready() {
      // Focus on play button on page load
      const playbutton = this.$select('playbutton')
      if (playbutton && playbutton.$focus) {
        playbutton.$focus()
      }
    },
    async init() {
      if (this.postData === undefined) {
        const postInfo = await Floatplane.getPostInfo(this.id)
        if (postInfo[0] !== undefined) {
          this.post = postInfo[0]
        }
      } else {
        this.post = this.postData
      }
      // Redirect to subscriptions list if post not found
      if (this.post['id'] === undefined) {
        this.$router.to('/subscriptions')
      }
      // Set title
      this.title = this.post['title']
      // Set cover image
      this.cover = Floatplane.getTargetImageSize(this.post['thumbnail'], 1920)
    },
  },
  input: {
    enter() {
      this.$router.to('/player/' + this.post['videoAttachments'][0])
    },
  },
})
