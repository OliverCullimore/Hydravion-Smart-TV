import Blits from '@lightningjs/blits'

import Floatplane from '../api/Floatplane'
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
        :h="1080/3"
        :y.transition="$keyboardY"
        :alpha.transition="$keyboardAlpha"
        color="#26272b"
      >
        <Keyboard margin="70" ref="keyboard" x="500" y="-5" />
      </Element>
      <Element w="480" h="600" :x="1920/2" :y="1080/2" mount="0.5">
        <Element
          src="assets/icon.svg"
          w="150"
          h="150"
          :y.transition="{value: $logoY, duration: 200}"
          x="125"
          color="#fff"
        />

        <Element :show.transition="$errorMessage" w="400" h="60" y="80">
          <Text :content="$errorMessage" size="20" align="center" color="#f44242" x="50%" y="50%" mount="{x:0.5, y:0.5}" />
        </Element>

        <Element y="170" :show="!$prompt2FA">
          <Text size="20">Username or Email</Text>
          <Input y="32" ref="username" :inputText="$username" placeholderText="Username" />
        </Element>

        <Element y="290" :show="!$prompt2FA">
          <Text size="20">Password</Text>
          <Input y="32" ref="password" mask="true" :inputText="$password" placeholderText="Password" />
        </Element>

        <Element y="290" :show="$prompt2FA">
          <Text size="20">2FA Code</Text>
          <Input y="32" ref="token" mask="true" :inputText="$token" placeholderText="Code" />
        </Element>

        <Button ref="button" y="410" buttonText="Login" textAlign="center" />
      </Element>
    </Element>
  `,
  state() {
    return {
      logoY: 0,
      errorMessage: '',
      username: import.meta.env.VITE_USERNAME ?? '',
      password: import.meta.env.VITE_PASSWORD ?? '',
      token: '',
      index: 0,
      keyboardAlpha: 0,
      keyboardY: 1080,
      error: false,
      prompt2FA: false,
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
    setErrorMessage(message) {
      this.errorMessage = message
      this.logoY = this.errorMessage === '' ? 0 : -70
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
      } else if (this.focusable[this.index] === 'token') {
        if (char == 'Backspace') {
          this.token = this.removeLastChar(this.token)
          return
        }
        this.token += char
      }
    },
    registerListeners() {
      this.$listen('onKeyboardInput', ({ key }) => {
        this.handleKey(key)
      })
    },
    async processLogin() {
      if (this.prompt2FA && this.token === '') {
        this.setErrorMessage('2FA Code field is required')
      } else {
        if (this.username === '') {
          this.setErrorMessage('Username or Email field is required')
        } else if (this.username.length < 4) {
          this.setErrorMessage('Username or Email field must contain at least 4 characters')
        } else if (this.password === '') {
          this.setErrorMessage('Password field is required')
        }
      }
      // Submit login request
      let loginResult = this.prompt2FA
        ? await Floatplane.login2fa(this.token)
        : await Floatplane.login(this.username, this.password)

      // Show any error messages
      if (loginResult['message'] !== undefined) {
        this.setErrorMessage(loginResult['message'])

        // Prompt for 2FA code if needed
      } else if (loginResult['needs2FA'] !== undefined && loginResult['needs2FA']) {
        this.prompt2FA = true
        this.focusable = ['token', 'button']
        this.index = 0
        this.setFocus()

        // Logged in
      } else if (loginResult['user']['id'] !== undefined) {
        this.$appState.loggedIn = true
        this.$appState.user.id = loginResult['user']['id']
        this.$appState.user.username = loginResult['user']['username']
        this.$router.to('/subscriptions')

        // Unknown error
      } else {
        this.setErrorMessage('Unknown error occurred. Please try again')
      }
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
        case 'token':
          this.keyboardAlpha = 1
          this.keyboardY = (1080 / 3) * 2
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
