// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву контейнера
    name: 'index',
    // вказуємо назву компонентів
    component: [],

    // вказуємо назву сторінки
    title: 'Index page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/home', function (req, res) {
  res.render('home', {
    name: 'home',
    component: [],

    title: 'Home page',
    data: {},
  })
})

router.get('/logout', function (req, res) {
  res.render('logout', {
    name: 'logout',
    component: [],

    title: 'Log out page',
    data: {},
  })
})

// Підключіть файли роутів
const auth = require('./auth')
// Підключіть інші файли роутів, якщо є
// Об'єднайте файли роутів за потреби
router.use('/', auth)
// Використовуйте інші файли роутів, якщо є
// Експортуємо глобальний роутер
module.exports = router
