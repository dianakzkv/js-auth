// Підключаємо технологію express для back-end сервера
const express = require('express')
// const bodyParser = require('body-parser')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// router.use(bodyParser.json())

const { User } = require('../class/user')
const { use } = require('./auth')

// ================================================================

router.get('/user-list', function (req, res) {
  return res.render('user-list', {
    name: 'user-list',
    component: ['back-button'],
    title: 'User list page',
    data: {},
  })
})

router.get('/user-list-data', function (req, res) {
  const list = User.getList()

  if (list.lenght === 0) {
    return res
      .status(400)
      .json({ message: 'Список користувачів порожній' })
  }

  return res.status(200).json({
    //   list: list.map((item) => ({
    //     id: item.id,
    //     email: item.email,
    //     role: item.role,
    //   })),
    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

router.get('/user-item', function (req, res) {
  return res.render('user-item', {
    name: 'user-item',
    component: ['back-button'],
    title: 'User item page',
    data: {},
  })
})

router.get('/user-item-data', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      message: 'Потрібно передати ID користувача',
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: 'Користувач з таким ID не існує',
    })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirmByCode: user.isConfirmByCode,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
