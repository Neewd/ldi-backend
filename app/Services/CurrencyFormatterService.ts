import { CurrencyFormatterInterface } from "@ioc:LaDouceImpatience/CurrencyFormatterService";
import Currency from "App/Models/Currency";

export default class CurrencyFormatterService implements CurrencyFormatterInterface  {

    format (amount: number, currency: Currency): string {
        let formattedAmount = amount.toString();
        if (formattedAmount !== '0') {
            const wholePart = formattedAmount.substring(0, formattedAmount.length - currency.decimal_places);
            const decimalPart = formattedAmount.substring(formattedAmount.length - currency.decimal_places);
    
            formattedAmount = wholePart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousand_separator).trim() + currency.decimal_point + decimalPart
        } else {
            formattedAmount = currency.format.replace('{price}', formattedAmount);
        }

        return formattedAmount
    }
  
}