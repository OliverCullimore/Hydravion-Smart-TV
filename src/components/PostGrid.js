import Blits from '@lightningjs/blits'
import Post from './Post'

export default Blits.Component('PostGrid', {
  components: {
    Post,
  },
  template: `
    <Element :y.transition="$y">
      <Element :src="$coverImage" w="1920" h="500" />
      <Text :content="$title" size="50" maxwidth="1920" x="70" y="550" />
      <Post
        :for="(item, index) in $items"
        thumbnail="$item.thumbnail"
        title="$item.title"
        type="$item.type"
        duration="$item.duration"
        :x="$margin + ($index % ($columns)) * $totalWidth"
        :y="640 + Math.floor($index / $columns) * $totalHeight"
        :ref="'postgrid-item-' + $item.id"
        :key="$item.id"
        width="$itemWidth"
        height="$itemHeight"
      />
    </Element>
  `,
  props: [
    'ref',
    'itemHeight',
    'itemWidth',
    'itemOffset',
    'items',
    'columns',
    'margin',
    'looping',
    'title',
    'coverImage',
  ],
  state() {
    return {
      focusIndex: 0,
      y: 0,
    }
  },
  computed: {
    totalWidth() {
      return (this.itemWidth || 300) + (this.itemOffset || 0)
    },
    totalHeight() {
      return (this.itemHeight || 300) + (this.itemOffset || 0)
    },
  },
  hooks: {
    ready() {
      this.$setTimeout(() => {
        this.$trigger('focusIndex')
      }, 1000)
    },
    focus() {
      this.$trigger('focusIndex')
    },
  },
  watch: {
    focusIndex(value) {
      if (this.items[value] !== undefined) {
        const focusItem = this.$select(`postgrid-item-${this.items[value].id}`)
        if (focusItem && focusItem.$focus) {
          focusItem.$focus()
          this.scrollToFocus(value)
        }
      }
    },
  },
  methods: {
    scrollToFocus(index) {
      this.y =
        -Math.floor((index <= this.items.length ? index : this.items.length) / this.columns) *
        this.totalHeight
    },
  },
  input: {
    up(e) {
      const columns = this.columns
      const previousIndex = this.focusIndex - columns

      if (previousIndex >= 0) {
        this.focusIndex = previousIndex
      } else if (this.looping) {
        // first see if we can go to the last row on this column
        const lastRow = this.items.length - (this.items.length % columns)
        const lastRowColumn = lastRow + (this.focusIndex % columns)
        this.focusIndex =
          lastRowColumn < this.items.length ? lastRowColumn : lastRowColumn - columns
      }
    },
    down(e) {
      const columns = this.columns
      const nextIndex = this.focusIndex + columns

      if (nextIndex < this.items.length) {
        this.focusIndex = nextIndex
      } else if (this.looping) {
        this.focusIndex = nextIndex % columns
      }
    },
    left(e) {
      const columns = this.columns

      const isNotFirstInRow = this.focusIndex % columns > 0
      const isWithinBounds = this.focusIndex + columns - 1 < this.items.length

      if (isNotFirstInRow) {
        this.focusIndex -= 1
      } else if (this.looping) {
        this.focusIndex = isWithinBounds ? this.focusIndex + columns - 1 : this.items.length - 1
      }
    },
    right(e) {
      const columns = this.columns

      const isNotLastInRow = this.focusIndex % columns < columns - 1
      const isNotLastItem = this.focusIndex < this.items.length - 1

      if (isNotLastInRow && isNotLastItem) {
        this.focusIndex += 1
      } else if (this.looping) {
        const index = this.focusIndex - columns + 1
        this.focusIndex = isNotLastItem ? index : Math.floor(this.focusIndex / columns) * columns
      }
    },
    enter() {
      this.$emit('onGridSelect-' + this.ref, {
        item: this.items[this.focusIndex],
      })
    },
  },
})
