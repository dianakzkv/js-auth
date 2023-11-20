// Підключаємо технологію express для back-end сервера
const express = require('express')
// const bodyParser = require('body-parser')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// router.use(bodyParser.json())

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'user@gmail.com',
  password: '123qweQWE',
  role: 1,
})
User.create({
  email: 'admin@mail.com',
  password: 123,
  role: 2,
})
User.create({
  email: 'developer@mail.com',
  password: 123,
  role: 3,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body
  console.log(req.body)
  console.log('поля: ', email, password, role)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відсутні!`,
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: `Користувач з таким email вже існує!`,
      })
    }

    const newUser = User.create({ email, password, role })
    console.log('newUser : ', newUser)

    const session = Session.create(newUser)
    console.log('session : ', session)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка створення користувача',
    })
  }
})

router.get('/recovery', function (req, res) {
  return res.render('recovery', {
    name: 'recovery',
    component: ['back-button', 'field'],
    title: 'Recovery page',
    data: {},
  })
})

router.post('/recovery', function (req, res) {
  const { email } = req.body
  console.log('recovery-email : ', email)

  if (!email) {
    return res.status(400).json({
      message: `Помилка. Обов'язкові поля відсутні!`,
    })
  }

  try {
    const user = User.getByEmail(email)
    console.log('User.getByEmail(email): ', user)

    if (!user) {
      return res.status(400).json({
        message: `Користувача з таким email не існує`,
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: `Код для відновлення паролю відправлено`,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.get('/recovery-confirm', function (req, res) {
  return res.render('recovery-confirm', {
    name: 'recovery-confirm',
    component: ['back-button', 'field', 'field-password'],
    title: 'Recovery confirm page',
    data: {},
  })
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body
  console.log(
    'recovery-confirm passw & code : ',
    password,
    code,
  )

  if (!code || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Такого кода не існує',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувача з таким email не існує',
      })
    }

    user.password = password

    console.log('change password for user : ', user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Пароль змінено',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }
  return res.render('signup-confirm', {
    name: 'signup-confirm',
    component: ['back-button', 'field'],
    title: 'Signup confirm page',
    data: {},
  })
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }
  console.log(code, token)

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Помилка. Ви не увійшли в аккаунт',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirmByCode = true

    session.user.isConfirmByCode = true

    return res.status(200).json({
      message: 'Ви підтвердили свою пошту',
      session,
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/login', function (req, res) {
  return res.render('login', {
    name: 'login',
    component: ['back-button', 'field', 'field-password'],
    title: 'Login page',
    data: {},
  })
})

router.post('/login', function (req, res) {
  const { email, password } = req.body
  console.log(email, password)

  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувач з таким email не існує!',
      })
    }

    if (password !== user.password) {
      return res.status(400).json({
        message: 'Помилка. Невірний пароль',
      })
    }

    const session = Session.create(user)

    return res
      .status(200)
      .json({ message: 'Ви увійшли', session })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})
// Підключаємо роутер до бек-енду
module.exports = router
