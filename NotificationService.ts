import store, { nextState } from 'store'
import StorageApi from './api/StorageApi'

export type TNotification = { title: string, message: string, date: string }

class NotificationService
{
  store = store
  nextState = nextState

  init = async () => {
    const notifications = (await StorageApi.get('notifications') || []) as TNotification[]
    this.nextState({ ...this.store.getState(), notifications })
  }

  addNotification = (title: string, message: string) => {
    const state = this.store.getState()
    const notifications = state.notifications
    this.nextState({ ...state, notifications: [...notifications, { title, message, date: '' }] })
    StorageApi.set('notifications', notifications).catch(console.error)
  }

  markAsRead = (notification: TNotification) => {
    const state = this.store.getState()
    const notifications = state.notifications.filter(n => n !== notification)
    this.nextState({ ...state, notifications })
    StorageApi.set('notifications', notifications).catch(console.error)
  }
}

const notificationService = new NotificationService()
window['notificationService'] = notificationService

export default notificationService
