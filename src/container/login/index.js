import { Form, REG_EXP_EMAIL } from '../../script/form'

import { saveSession } from '../../script/session'

class LoginForm extends Form {
  FIELD_NAME = {
    EMAIL: 'email',
    PASSWORD: 'password',
  }

  FIELD_ERROR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
    EMAIL: 'Введіть коректне значення e-mail адреси',
  }

  validate = (name, value) => {
    if (value === undefined) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (name === this.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value))) {
        return this.FIELD_ERROR.EMAIL
      }
    }

    // if (
    //   String(value).length > 20 &&
    //   name !== this.FIELD_NAME.EMAIL
    // ) {
    //   return this.FIELD_ERROR.IS_BIG
    // }
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      this.setAlert('progress', 'Завантаження...')

      console.log(this.value)

      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          console.log(data.session)
          this.setAlert('success', data.message)
          saveSession(data.session)
          location.assign('/')
        } else {
          this.setAlert('error', data.message)
          console.log(data)
        }
      } catch (error) {
        console.log(error.message)
        this.setAlert('error', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
    })
  }
}

window.loginForm = new LoginForm()

document.addEventListener('DOMContentLoaded', () => {
  if (window.session) {
    location.assign('/')
  }
})
