import Blits from '@lightningjs/blits'

import Input from '../components/Input'
import Button from '../components/Button'
import Keyboard from '../components/Keyboard'

export default Blits.Component('Login', {
  components: {
    Input,
    Button,
    Keyboard,
  },
  template: `
    <Element>
      <Element
        x="0"
        w="1920"
        y="1080"
        z="1"
        :h="(1080/3)*1.5"
        :y.transition="$keyboardY"
        :alpha.transition="$keyboardAlpha"
        color="#26272b"
      >
        <Keyboard margin="70" ref="keyboard" x="500" />
      </Element>
      <Element w="480" h="600" :x="1920/2" :y="1080/2" mount="0.5">
        <Element src="assets/icon.svg" w="100" h="100" :x="50% - (190 / 2)" mount="{x: 0.2}" color="#fff" />
        <Element y="150">
          <Text size="20">Username or Email</Text>
          <Input y="32" ref="username" :inputText="$username" placeholderText="Username" />
        </Element>
        <Element y="270">
          <Text size="20">Password</Text>
          <Input y="32" ref="password" mask="true" :inputText="$password" placeholderText="Password" />
        </Element>
        <Button ref="button" y="390" buttonText="Login" textAlign="center" />
      </Element>
    </Element>
  `,
  state() {
    return {
      username: '',
      password: '',
      index: 0,
      keyboardAlpha: 0,
      keyboardY: 1080,
      focusable: ['username', 'password', 'button'],
    }
  },
  hooks: {
    ready() {
      // Focus on username field on page load
      const username = this.$select('username')
      if (username && username.$focus) {
        username.$focus()
      }
    },
    focus() {
      if (this.keyboardAlpha) {
        this.keyboardAlpha = 0
        this.keyboardY = 1080
      }
      this.setFocus()
    },
    init() {
      this.registerListeners()
    },
  },
  methods: {
    setFocus() {
      console.debug('setting focus to:', this.focusable[this.index])
      const next = this.$select(this.focusable[this.index])
      if (next && next.$focus) {
        next.$focus()
      }
    },
    removeLastChar(str) {
      return str.substring(0, str.length - 1)
    },
    handleKey(char) {
      if (this.focusable[this.index] === 'username') {
        if (char == 'Backspace') {
          this.username = this.removeLastChar(this.username)
          return
        }
        this.username += char
      } else if (this.focusable[this.index] === 'password') {
        if (char == 'Backspace') {
          this.password = this.removeLastChar(this.password)
          return
        }
        this.password += char
      }
    },
    registerListeners() {
      this.$listen('onKeyboardInput', ({ key }) => {
        this.handleKey(key)
      })
    },
    async processLogin() {
      console.log('login submission:', this.username, this.password)
    },
  },
  input: {
    up() {
      this.index = this.index === 0 ? this.focusable.length - 1 : this.index - 1
      this.setFocus()
    },
    down() {
      this.index = this.index === this.focusable.length - 1 ? 0 : this.index + 1
      this.setFocus()
    },
    right() {
      // Refocus child because we don't have a right focus
      this.setFocus()
    },
    left() {
      // Refocus child because we don't have a left focus
      this.setFocus()
    },
    enter() {
      const currentFocusable = this.focusable[this.index]
      let element = null
      switch (currentFocusable) {
        case 'button':
          this.processLogin()
          break
        case 'username':
        case 'password':
          this.keyboardAlpha = 1
          this.keyboardY = (1080 / 3) * 1.78
          element = this.$select('keyboard')
          if (element && element.$focus) {
            element.$focus()
          }
          break
        default:
          console.warn('Unrecognized focusable element:', currentFocusable)
      }
    },
    back() {
      this.handleKey('Backspace')
    },
    any(e) {
      // filter only characters that can be printed
      if (e.key.match(/^[\w\s.,;!@#$%^&*()_+\-=[\]{}|\\:'"<>,.?/~`]$/)) {
        this.handleKey(e.key)
      }
    },
  },
})
