const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config.js')

const hbs = require('express-handlebars')

const compiler = webpack(config)
const app = express()

dotenv.config()

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }),
)

app.use(webpackHotMiddleware(compiler))

app.set('view engine', 'hbs')
app.set('views', 'src/container')
app.engine(
  'hbs',
  hbs.engine({
    extname: 'hbs',
    defaultLayout: 'default/index',
    layoutsDir: __dirname + '/src/layout/',
    partialsDir: {
      dir: __dirname + '/src/component/',
      rename: (filePath) => {
        return `${filePath.split('/')[0]}`
      },
    },
  }),
)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
  const livereload = require('livereload')
  const connectLiveReload = require('connect-livereload')

  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, 'public'))
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/')
    }, 100)
  })
  app.use(connectLiveReload())
}

const route = require('./src/route/index.js')

app.use('/', route)
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error =
    req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', { message: err })
})

module.exports = app
