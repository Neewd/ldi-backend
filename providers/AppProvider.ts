import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import CurrencyFormatterService from 'App/Services/CurrencyFormatterService'
import PromotionService from 'App/Services/PromotionService'

export default class AppProvider {
	public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
    this.app.container.singleton('LaDouceImpatience/CurrencyFormatterService', () => new CurrencyFormatterService())
    this.app.container.singleton('LaDouceImpatience/PromotionService', () => new PromotionService())
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
