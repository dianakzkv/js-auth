import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserItem extends List {
  constructor() {
    super()

    this.element = document.querySelector('#user-item')
    if (!this.element) throw new Error('Element is null')

    // this.id = new URL(location.href).searchParams.get('id')
    this.id = new URLSearchParams(location.search).get('id')
    if (!this.id) location.assign('/user-list')

    this.loadData()
  }

  loadData = async () => {
    this.updateStatus(this.STATE.LOADING)

    try {
      const res = await fetch(
        `/user-item-data?id=${this.id}`,
        {
          method: 'GET',
        },
      )

      const data = await res.json()

      if (res.ok) {
        this.updateStatus(
          this.STATE.SUCCESS,
          this.convertData(data),
        )
      } else {
        this.updateStatus(this.STATE.ERROR, data)
      }
    } catch (e) {
      console.log(e)
      this.updateStatus(this.STATE.ERROR, {
        message: error.message,
      })
    }
  }

  convertData = (data) => {
    return {
      ...data,
      user: {
        ...data.user,
        role: USER_ROLE[data.user.role],
        confirm: data.user.isConfirmByCode ? 'Так' : 'Ні',
      },
    }
  }

  updateView = () => {
    this.element.innerHTML = ''

    console.log(this.status, this.data)

    switch (this.status) {
      case this.STATE.LOADING:
        this.element.innerHTML = `
			<div class="data">
				<span class="data__title">ID</span>
				<span class="data__value skeleton"></span>
			</div>
			<div class="data">
				<span class="data__title">E-mail</span>
				<span class="data__value skeleton"></span>
			</div>
			<div class="data">
				<span class="data__title">Pоль</span>
				<span class="data__value skeleton"></span>
			</div>
			<div class="data">
				<span class="data__title">Пошта підтверджена?</span>
				<span class="data__value skeleton"></span>
			</div>
		`
        break

      case this.STATE.SUCCESS:
        const { id, email, role, confirm } = this.data.user

        this.element.innerHTML = `
				<div class="data">
					<span class="data__title">ID</span>
					<span class="data__value">${id}</span>
				</div>
				<div class="data">
					<span class="data__title">E-mail</span>
					<span class="data__value">${email}</span>
				</div>
				<div class="data">
					<span class="data__title">Pоль</span>
					<span class="data__value ">${role}</span>
				</div>
				<div class="data">
					<span class="data__title">Пошта підтверджена?</span>
					<span class="user__value ">${confirm}</span>
				</div>
			`

        break

      case this.STATE.ERROR:
        this.element.innerHTML = `
		<span class="alert alert--error">${this.data.message}</span>
		`
        break
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (
      !window.session ||
      !window.session.user.isConfirmByCode
    ) {
      location.assign('/')
    }
  } catch (e) {}

  new UserItem()
})
