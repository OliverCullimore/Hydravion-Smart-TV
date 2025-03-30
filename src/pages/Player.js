import Blits from '@lightningjs/blits'

import Floatplane from '../api/Floatplane'
import PlayerManager from '../managers/PlayerManager'

export default Blits.Component('Player', {
  template: `
    <Element>
      <Element
        y="1080"
        mount="{y:1}"
        w="1920"
        h="150"
        :color="{top: 'transparent', bottom: '#444'}"
        :alpha.transition="$controlsVisibility"
      >
        <Element x="60" y="50">
          <Element w="60" h="60" color="#0087CEEB" :effects="[{type: 'radius', props: {radius:16}}]">
            <Element y="14" x="14" w="32" h="32" :src="$playing ? 'assets/player/pause.png' : 'assets/player/play.png'" />
          </Element>
          <Element
            y="22"
            x="100"
            w="$progressLength"
            h="16"
            color="#ffffff80"
            :effects="[{type: 'radius', props: {radius:8}}]"
          >
            <Element
              h="16"
              :w.transition="{value: $progress, d: 100, f: 'ease-in-out'}"
              :effects="[{type: 'radius', props: {radius:8}}]"
              color="#0087CEEB"
            />
            <Circle size="28" color="#fff" y="-6" :x.transition="{value: $progress - 8, d: 100, f: 'ease-in-out'}" />
          </Element>
          <Element x="1660" y="16">
            <Text :content="$currentTime" size="25" />
            <Text x="70" size="25" content="/" />
            <Text x="85" size="25" :content="$duration" />
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  props: ['id'],
  state() {
    return {
      streamURL: '',
      controlsVisibility: 0,
      progressLength: 1520,
      progress: 0,
      currentTime: '00:00',
      duration: '00:00',
      playing: false,
      hideTimeout: null,
    }
  },
  hooks: {
    focus() {
      this.$emit('clearBackground')
    },
    unfocus() {
      this.$emit('changeBackground')
    },
    async init() {
      // Init player
      await PlayerManager.init()
      // Get video info
      const videoInfo = await Floatplane.getVideoInfo(this.id)
      if (videoInfo['id'] !== undefined) {
        this.video = videoInfo
      }
      // Get delivery info
      const deliveryInfo = await Floatplane.getDeliveryInfo('vod', this.id)
      if (deliveryInfo['cdn'] !== undefined && deliveryInfo['resource']['uri'] !== undefined) {
        const qualityLevel =
          deliveryInfo.resource.data.qualityLevels[
            deliveryInfo.resource.data.qualityLevels.length - 1
          ].name
        const qualityLevelParam = deliveryInfo.resource.data.qualityLevelParams[qualityLevel]
        this.streamURL = deliveryInfo['cdn'] + deliveryInfo['resource']['uri']
        this.streamURL = this.streamURL.replace('{qualityLevelParams.2}', qualityLevelParam['2'])
        this.streamURL = this.streamURL.replace('{qualityLevelParams.4}', qualityLevelParam['4'])
      }
      // Redirect to subscriptions list if streamURL not found
      if (this.streamURL === '') {
        this.$router.to('/subscriptions')
      }
      // Load video
      await PlayerManager.load({
        streamUrl: this.streamURL,
      })
    },
    async ready() {
      const secondsToMmSs = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5)
      const duration = PlayerManager.getVideoDuration()
      if (duration) {
        this.duration = secondsToMmSs(duration)
        this.progressChunkSize = Math.round((this.progressLength / duration) * 100) / 100
      }
      this.$setInterval(() => {
        const currentTime = PlayerManager.getCurrentTime()
        this.currentTime = secondsToMmSs(currentTime)
        this.progress = Math.round(currentTime * this.progressChunkSize)
      }, 1000)
      this.play()
    },
    async destroy() {
      await PlayerManager.destroy()
    },
  },
  methods: {
    play() {
      this.showControls(1)
      this.hideTimeout = this.$setTimeout(() => this.showControls(0), 3000)
      if (PlayerManager.state.playingState == true) {
        PlayerManager.pause()
        this.playing = false
      } else {
        PlayerManager.play()
        this.playing = true
      }
    },
    showControls(v) {
      this.$clearTimeout(this.hideTimeout)
      this.controlsVisibility = v
    },
  },
  input: {
    space() {
      this.play()
    },
    up() {
      this.showControls(1)
    },
    down() {
      this.showControls(0)
    },
  },
})
