const path = require('path')
const glob = require('glob')

function getJsEntries() {
  const entries = {}

  const files = glob.sync('./src/**/*.js')

  files.forEach((file) => {
    const folderName = path.dirname(
      path.relative('./src', file),
    ) // Отримуємо шлях відносно папки './src'

    let folderTypeArr = folderName.split('/')

    if (folderTypeArr.length === 1) {
      folderTypeArr = folderName.split('\\')
    }

    const [folderType] = folderTypeArr

    if (
      ['container', 'component', 'layout'].includes(
        folderType,
      )
    ) {
      entries[folderName] = `./${file}`
    }
  })

  console.log(entries)

  return entries
}

module.exports = {
  entry: getJsEntries(),
  output: {
    path: path.join(__dirname, './public/dist/js'),
    filename: '[name]/index.js',
    publicPath: './public/dist',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
