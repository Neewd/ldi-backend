import { EventsList } from '@ioc:Adonis/Core/Event'
import Currency from "App/Models/Currency";
import Cart from "App/Models/Cart";
import CurrencyFormatterService from "@ioc:LaDouceImpatience/CurrencyFormatterService";
import Logger from '@ioc:Adonis/Core/Logger'

export default class User {

    async handleNewUser (user: EventsList['new:user']) {
        const cart = new Cart();

        try {
            const currency: Currency = await Currency.findByOrFail('default', true)

            cart.price_without_tax_currency = currency.code;
            cart.price_with_tax_currency = currency.code;
            cart.price_without_tax_amount = 0;
            cart.price_without_tax_formatted = CurrencyFormatterService.format(0, currency);
            cart.price_with_tax_amount = 0;
            cart.price_with_tax_formatted = CurrencyFormatterService.format(0, currency)
            cart.price_tax = 0;
            cart.user_uid = user.uid;

            await cart.save();
        } catch (error) {
            Logger.error(error);
        }

    }

}
