declare module '@ioc:LaDouceImpatience/CurrencyFormatterService' {
  import Currency from "App/Models/Currency";
  
  export interface CurrencyFormatterInterface {
    format(amount: number, currency: Currency): string
  }
  
  const CurrencyFormatterService: CurrencyFormatterInterface
  export default CurrencyFormatterService
}