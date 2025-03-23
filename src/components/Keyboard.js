import Blits from '@lightningjs/blits'

const Key = Blits.Component('Key', {
  template: `
    <Element w="$width" h="60" color="rgba(255, 255, 255, 0.1)">
      <Text :content="$inputValue" size="32" align="center" x="50%" y="50%" mount="{x:0.5, y:0.5}" />
    </Element>
  `,
  props: ['width', 'value', 'layout', 'focusIndex'],
  computed: {
    inputValue() {
      const key = this.layout === 'upper' ? this.value[1] : this.value[0]
      return key == ' ' ? 'Space' : key == 'Backspace' ? '⌫' : key
    },
  },
})

export default Blits.Component('Keyboard', {
  components: {
    Key,
  },
  template: `
    <Element>
      <Element :w="$focusKeyWidth" h="60" :x="$focusX" :y="$focusY" color="rgba(255, 255, 255, 0.6)" />
      <Key
        :for="(item, index) in $keys"
        :x="$keyX"
        ref="key"
        key="$item"
        width="$keyWidth"
        value="$item"
        :y="$keyY"
        :layout="$layout"
      />
    </Element>
  `,
  props: ['margin'],
  computed: {
    focusX() {
      return (this.focusIndex % this.perRow) * this.margin
    },
    focusY() {
      return ~~(this.focusIndex / this.perRow) * this.margin + 50
    },
    focusKeyWidth() {
      const key = this.keys[this.focusIndex]
      return this.getKeyWidth(this.layout === 'upper' ? key[1] : key[0])
    },
    keyX() {
      return (this.index % this.perRow) * this.margin
    },
    keyY() {
      return Math.floor(this.index / this.perRow) * this.margin + 50
    },
    keyWidth() {
      return this.getKeyWidth(this.item[0])
    },
  },
  state() {
    return {
      focusIndex: 0,
      perRow: 13,
      layout: 'lower',
      keys: [
        ['1', '!'],
        ['2', '"'],
        ['3', '£'],
        ['4', '$'],
        ['5', '%'],
        ['6', '^'],
        ['7', '&'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        ['Backspace', 'Backspace'],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['[', '{'],
        [']', '}'],
        ['Enter', 'Enter'],
        ['a', 'A'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        [';', ':'],
        ['@', "'"],
        ['#', '~'],
        ['Shift', 'Shift'],
        ['\\', '|'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', '<'],
        ['.', '>'],
        ['/', '?'],
        [' ', ' '],
      ],
    }
  },
  hooks: {
    focus() {
      // Reset when re-opening keyboard
      this.layout = 'lower'
      this.focusIndex = 0
    },
  },
  methods: {
    getKeyWidth(key) {
      switch (key) {
        case 'Backspace':
        case 'Enter':
        case 'Shift':
          return 130
        case ' ':
          return 200
        default:
          return 60
      }
    },
  },
  input: {
    left() {
      if (this.focusIndex % this.perRow === 0) {
        this.focusIndex = Math.min(this.focusIndex + this.perRow - 1, this.keys.length - 1)
      } else {
        this.focusIndex = Math.max(this.focusIndex - 1, 0)
      }
    },
    right() {
      if (this.focusIndex % this.perRow === this.perRow - 1) {
        this.focusIndex -= this.perRow - 1
      } else {
        this.focusIndex = Math.min(this.focusIndex + 1, this.keys.length - 1)
      }
    },
    up() {
      this.focusIndex = Math.max(this.focusIndex - this.perRow, 0)
    },
    down() {
      this.focusIndex = Math.min(this.focusIndex + this.perRow, this.keys.length - 1)
    },
    enter() {
      let key = this.keys[this.focusIndex]
      if (key[0] === 'Shift') {
        this.layout = this.layout === 'lower' ? 'upper' : 'lower'
      } else if (key[0] === 'Enter') {
        this.parent.$focus()
      } else {
        this.$emit('onKeyboardInput', {
          key: this.layout === 'upper' ? key[1] : key[0],
        })
      }
    },
    any(e) {
      if (e.key === 'Shift') {
        this.layout = this.layout === 'lower' ? 'upper' : 'lower'
      }
    },
    back() {
      this.parent.$focus()
    },
  },
})
