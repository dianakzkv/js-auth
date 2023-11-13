class BackButton {
  static back() {
    return window.history.back()
  }
}

window.backButton = BackButton