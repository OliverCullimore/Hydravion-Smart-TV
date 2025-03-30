import Blits from '@lightningjs/blits'

import Floatplane from '../api/Floatplane'
import PostGrid from '../components/PostGrid'

export default Blits.Component('Channel', {
  components: {
    PostGrid,
  },
  template: `
    <Element>
      <PostGrid
        ref="posts"
        :itemWidth="$itemWidth"
        :itemHeight="$itemHeight"
        itemOffset="$itemOffset"
        :items="$items"
        columns="$columns"
        margin="$margin"
        looping="false"
        :coverImage="$coverImage"
        :title="$title"
      />
    </Element>
  `,
  props: ['id', 'channelid', 'creatorData', 'channelData'],
  state() {
    return {
      margin: 70,
      columns: 4,
      itemOffset: 40,
      creator: Array(),
      channel: Array(),
      title: '',
      coverImage: '',
      livestream: Array(),
      posts: Array(),
      items: Array(),
    }
  },
  computed: {
    itemWidth() {
      return (1920 - this.margin * 1.4) / this.columns - this.itemOffset
    },
    itemHeight() {
      return 1080 / 3.3
    },
  },
  hooks: {
    ready() {
      // Focus on grid on page load
      const grid = this.$select('posts')
      if (grid && grid.$focus) {
        grid.$focus()
      }
    },
    async init() {
      if (this.creatorData === undefined) {
        const creatorInfo = await Floatplane.getCreatorsInfo([this.id])
        if (creatorInfo[0] !== undefined) {
          this.creator = creatorInfo[0]
        }
      } else {
        this.creator = this.creatorData
      }
      if (this.channelid !== '' && this.channelData === undefined) {
        this.channel = this.creator['channels'].find((x) => x.id === this.channelid)
      } else {
        this.channel = this.channelData
      }
      // Redirect to subscriptions list if creator not found
      if (
        this.creator['id'] === undefined ||
        (this.channelid !== undefined && this.channel === undefined)
      ) {
        this.$router.to('/subscriptions')
      }
      if (this.channel !== undefined && this.channel['title'] !== undefined) {
        // Set title
        this.title = this.channel['title']
        // Set cover image
        this.coverImage = this.channel['cover']['path']
        if (
          this.channel['cover']['childImages'].length > 0 &&
          this.channel['cover']['childImages'][0]['path'] !== undefined
        ) {
          this.coverImage = this.channel['cover']['childImages'][0]['path']
        }
      } else {
        // Set title
        this.title = this.creator['title']
        // Set cover image
        this.coverImage = this.creator['cover']['path']
        if (
          this.creator['cover']['childImages'].length > 0 &&
          this.creator['cover']['childImages'][0]['path'] !== undefined
        ) {
          this.coverImage = this.creator['cover']['childImages'][0]['path']
        }
      }
      this.coverImage = this.coverImage.replace('https://pbs.floatplane.com', '')
      // Set livestream info
      this.livestream = this.creator['livestream']
      // Get creator posts
      this.posts = await Floatplane.getCreatorBlogPosts(this.creator['id'], this.channelid ?? '')
      // Videos list for fetching progress
      let videos = Array()
      // Add item for each post
      this.posts.forEach((post) => {
        // Type
        let postType = Array()
        if (post['metadata']['hasVideo']) {
          postType.push('Video')
        }
        if (post['metadata']['hasAudio']) {
          postType.push('Audio')
        }
        if (post['metadata']['hasPicture']) {
          postType.push('Picture')
        }
        if (postType.length === 0) {
          postType.push('Text')
        }
        // Thumbnail
        let postThumbnail = ''
        if (post['thumbnail'] !== undefined) {
          if (
            post['thumbnail']['childImages'].length > 0 &&
            post['thumbnail']['childImages'][0]['path'] !== undefined
          ) {
            postThumbnail = post['thumbnail']['childImages'][0]['path']
          } else {
            postThumbnail = post['thumbnail']['path']
          }
        }
        // Duration
        let durationSeconds = 0
        if (post['metadata'] !== undefined) {
          if (
            post['metadata']['videoDuration'] !== undefined &&
            post['metadata']['videoDuration'] > 0
          ) {
            durationSeconds = post['metadata']['videoDuration']
            if (
              post['metadata']['videoCount'] !== undefined &&
              post['metadata']['videoCount'] > 0
            ) {
              durationSeconds = durationSeconds / post['metadata']['videoCount']
            }
          } else if (
            post['metadata']['audioDuration'] !== undefined &&
            post['metadata']['audioDuration'] > 0
          ) {
            durationSeconds = post['metadata']['audioDuration']
          }
        }
        let duration = ''
        if (durationSeconds > 0) {
          let hours = Math.floor(durationSeconds / 60 / 60)
          let minutes = Math.floor(durationSeconds / 60) - hours * 60
          let seconds = durationSeconds % 60
          if (hours > 0) {
            duration += hours.toString().padStart(2, '0') + ':'
          }
          duration += minutes.toString().padStart(2, '0') + ':'
          duration += seconds.toString().padStart(2, '0')
        }
        // Add video to list for fetching progress
        if (post['videoAttachments'] !== undefined && post['videoAttachments'][0] !== undefined) {
          videos.push(post['videoAttachments'][0])
        }
        this.items.push({
          id: post.id,
          type: postType.join(' '),
          title: post.title,
          thumbnail: postThumbnail.replace('https://pbs.floatplane.com', ''),
          text: post.text,
          duration: duration,
        })
      })
      // Get videos progress
      /*if (videos.length > 0) {
        Floatplane.getVideosProgressPercentage(videos, 'blogPost')
      }*/
      // Register grid item select listener
      this.registerListeners()
    },
  },
  methods: {
    registerListeners() {
      // Listen for events from grid item selections
      this.$listen('onGridSelect-posts', ({ item }) => {
        this.$router.to('/details/' + item.id, {
          postData: this.posts.find((x) => x.id === item.id),
        })
      })
    },
  },
})
