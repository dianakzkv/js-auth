class SignupForm {
  static value = {}

  static validate = (name, value) => {
    return true
  }

  static submit = () => {
    console.log(this.value)
  }

  static change = (name, value) => {
    console.log(name, value)
    if (this.validate(name, value)) this.value[name] = value
  }
}

window.signupForm = SignupForm
