import { HttpRequest } from 'classes/http/HttpRequest'
import applicationStoreService from './services/ApplicationStoreService'
import userService from 'classes/services/UserService'
import authService from 'classes/services/AuthService'
import widgetStoreService from './services/WidgetStoreService'
import partnerStoreService from './services/PartnerStoreService'
import roleStoreService from './services/RoleStoreService'
import notificationService from './services/NotificationService'
import sitePageStoreService from './services/SitePageStoreService'
import userEventService from 'classes/userEvents/UserEventService'
import referenceStoreService from 'classes/services/ReferenceStoreService'
import StorageApi from 'classes/services/api/StorageApi'
import cacheAdapterNull from 'classes/cache/adapters/CacheAdapterNull'
import cache from 'classes/cache/Cache'

class Bootstrap {
  async init(): Promise<void> {
    this.registerEventListeners()
    HttpRequest.setRefreshTokenFunction(authService.refreshToken)
    if (authService.hasToken()) {
      await authService.refreshToken()
      if (!await userService.init()) {
        userService.logout()
      }

      cache.setAdapter(cacheAdapterNull)
      await cache.versionInvalidator(3)
      applicationStoreService.setAppId('lut')
      const promiseStorage = StorageApi.init()
      await Promise.all([promiseStorage])

      return this.sync().then(() => {
        partnerStoreService.init().catch(console.error)
        notificationService.init().catch(console.error)
        referenceStoreService.init().catch(console.error)
        userEventService.register('login').catch(console.error)
      })
    }
    authService.clearToken()
  }

  async sync(): Promise<any> {
    const promiseRoles = roleStoreService.init()
    const promiseWidgets = widgetStoreService.init()
    const promiseSitePages = promiseWidgets.then(widgets => sitePageStoreService.fetch(widgets))
    return Promise.all([promiseWidgets, promiseRoles, promiseSitePages])
  }

  private registerEventListeners = () => {
    HttpRequest.on('response-401', () => {
      userService.logout()
    })
  }
}

window['cache'] = cache
export default new Bootstrap()
