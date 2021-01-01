import { EventsList } from '@ioc:Adonis/Core/Event'
import Inventory from 'App/Models/Inventory'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Product {

    async handleNewProduct (product: EventsList['new:product']) {
        const inventory = new Inventory();
        inventory.total = 0;
        inventory.available = 0;
        inventory.allocated = 0;
        inventory.product_uid = product.uid;

        try {
            await inventory.save()
        } catch (error) {
            Logger.error(error)
        }
    }

}
