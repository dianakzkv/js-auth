import { saveSession } from '../../script/session'

document.addEventListener('DOMContentLoaded', () => {
  saveSession(null)

  location.assign('/')
})
