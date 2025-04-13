import Blits from '@lightningjs/blits'

import Floatplane from '../api/Floatplane'
import SubscriptionsRow from '../components/SubscriptionsRow'

export default Blits.Component('Subscriptions', {
  components: {
    SubscriptionsRow,
  },
  template: `
    <Element>
      <Element x="200" :y.transition="$y">
        <SubscriptionsRow
          :for="(subscription, index) in $subscriptions"
          :ref="'subscriptions-' + $subscription.id"
          :key="$subscription.id"
          :y="$index * $totalHeight"
          itemWidth="$itemWidth"
          itemHeight="$itemHeight"
          itemOffset="$itemOffset"
          :items="$subscription.channels"
          looping="true"
        />
      </Element>
      <Element w="1920" h="200" color="#18181b">
        <Element w="1920" h="70" y="200" color="{top: '#18181b'}" />
        <Text size="60" maxwidth="1920" x="70" y="70">Subscriptions</Text>
      </Element>
    </Element>
  `,
  state() {
    return {
      focused: 0,
      looping: true,
      y: 500,
      itemWidth: 150,
      itemHeight: 250,
      itemOffset: 100,
      subscriptions: Array(),
      creators: Array(),
    }
  },
  computed: {
    totalHeight() {
      return this.itemHeight + this.itemOffset
    },
  },
  hooks: {
    ready() {
      this.$setTimeout(() => {
        this.$trigger('focused')
      }, 1000)
    },
    focus() {
      this.$trigger('focused')
    },
    async init() {
      // Get active user subscriptions
      const subscriptions = await Floatplane.getSubscriptions()
      // Get creator IDs from subscriptions list
      const creatorIds = subscriptions.map((subscription) => subscription.creator)
      // Get creators info
      this.creators = await Floatplane.getCreatorsInfo(creatorIds)
      // Redirect if only a single creator and no sub channels
      if (this.creators.length === 1 && this.creators[0].channels.length === 1) {
        this.$router.to('/channel/' + this.creators[0].id, {
          creatorData: this.creators.find((x) => x.id === this.creators[0].id),
        })
        return
      }
      // Add item for each creator
      this.creators.forEach((creator) => {
        let subscription = {
          id: creator.id,
          channels: Array({
            id: creator.id,
            creatorId: creator.id,
            type: 'creator',
            title: '',
            logo: Floatplane.getTargetImageSize(creator.icon, 300),
          }),
        }
        // Add child item for each creator channel
        if (creator.channels.length) {
          creator.channels.forEach((channel) => {
            subscription.channels.push({
              id: channel.id,
              creatorId: creator.id,
              type: 'channel',
              title: channel.title,
              logo: Floatplane.getTargetImageSize(channel.icon, 300),
            })
          })
        }
        this.subscriptions.push(subscription)
      })
      // Register grid item select listener
      this.registerListeners()
    },
  },
  watch: {
    focused(value) {
      if (this.subscriptions[value] !== undefined) {
        const focusItem = this.$select(`subscriptions-${this.subscriptions[value].id}`)
        if (focusItem && focusItem.$focus) {
          focusItem.$focus()
          this.scrollToFocus(value)
        }
      }
    },
  },
  methods: {
    registerListeners() {
      this.subscriptions.forEach((subscription) => {
        // Listen for events from grid item selections
        this.$listen('onSubscriptionRowSelect-subscriptions-' + subscription.id, ({ item }) => {
          if (item.type == 'channel') {
            this.$router.to('/channel/' + subscription.id + '/' + item.id, {
              creatorData: this.creators.find((x) => x.id === subscription.id),
              channelData: this.creators
                .find((x) => x.id === subscription.id)
                .channels.find((x) => x.id === item.id),
            })
          } else {
            this.$router.to('/creator/' + item.id, {
              creatorData: this.creators.find((x) => x.id === item.id),
            })
          }
        })
      })
    },
    changeFocus(direction) {
      const nextFocus = this.looping
        ? (this.focused + direction + this.subscriptions.length) % this.subscriptions.length
        : Math.max(0, Math.min(this.focused + direction, this.subscriptions.length - 1))
      this.focused = nextFocus
    },
    scrollToFocus(index) {
      this.y =
        500 -
        (index <= this.subscriptions.length ? index : this.subscriptions.length) * this.totalHeight
    },
  },
  input: {
    up() {
      this.changeFocus(-1)
    },
    down() {
      this.changeFocus(1)
    },
  },
})
