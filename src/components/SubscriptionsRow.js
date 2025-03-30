import Blits from '@lightningjs/blits'
import Subscription from './Subscription'

export default Blits.Component('SubscriptionsRow', {
  components: {
    Subscription,
  },
  template: `
    <Element :x.transition="$x">
      <Subscription
        :for="(item, index) in $items"
        logo="$item.logo"
        title="$item.title"
        :x="$index * $totalWidth"
        :ref="'list-item-' + $item.id"
        :key="$item.id"
        width="$itemWidth"
        height="$itemHeight"
      />
    </Element>
  `,
  props: ['itemOffset', 'itemHeight', 'itemWidth', 'items', 'looping'],
  state() {
    return {
      focused: 0,
      x: 0,
    }
  },
  computed: {
    totalWidth() {
      return (this.itemWidth || 300) + (this.itemOffset || 0)
    },
  },
  hooks: {
    focus() {
      this.$trigger('focused')
    },
  },
  watch: {
    focused(value) {
      if (this.items[value] !== undefined) {
        const focusItem = this.$select(`list-item-${this.items[value].id}`)
        if (focusItem && focusItem.$focus) {
          focusItem.$focus()
          this.scrollToFocus(value)
        }
      }
    },
  },
  methods: {
    changeFocus(direction) {
      const nextFocus = this.looping
        ? (this.focused + direction + this.items.length) % this.items.length
        : Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
      this.focused = nextFocus
    },
    scrollToFocus(index) {
      this.x = -(index <= this.items.length ? index : this.items.length) * this.totalWidth
    },
  },
  input: {
    left() {
      this.changeFocus(-1)
    },
    right() {
      this.changeFocus(1)
    },
    enter() {
      this.$emit('onSubscriptionRowSelect-' + this.ref, {
        item: this.items[this.focused],
      })
    },
  },
})
