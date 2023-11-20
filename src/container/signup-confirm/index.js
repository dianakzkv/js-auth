import { Form } from '../../script/form'

import {
  saveSession,
  getTokenSession,
  getSession,
} from '../../script/session'

class SignupConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
  }

  FIELD_ERROR = {
    IS_EMPTY: 'Введіть значення в поле',
    IS_BIG: 'Дуже довге значення, приберіть зайве',
  }

  validate = (name, value) => {
    console.log(name, value)
    if (value === undefined) {
      console.log(String(value).length, value)

      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 20) {
      return this.FIELD_ERROR.IS_BIG
    }
  }

  submit = async () => {
    if (this.disabled === true) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('progress', 'Завантаження...')

      try {
        const res = await fetch('/signup-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
          saveSession(data.session)
          location.assign('/')
        } else {
          this.setAlert('error', data.message)
          console.log(data)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      token: getTokenSession(),
    })
  }
}

window.signupConfirmForm = new SignupConfirmForm()

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.session) {
      if (window.session.user.isConfirmByCode) {
        location.assign('/')
      }
    } else {
      location.assign('/')
    }
  } catch (error) {}

  document
    .querySelector('#renew')
    .addEventListener('click', (e) => {
      e.preventDefault()

      const session = getSession()

      location.assign(
        `/signup-confirm?renew=true&email=${session.user.email}`,
      )
    })
})
