import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Inventory from 'App/Models/Inventory';
import Product from 'App/Models/Product';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { StockTransactionEnum } from 'App/Models/Enum/StockTransactionEnum';
import StockTransaction from 'App/Models/StockTransaction';
import { v4 as uuidv4 } from 'uuid';

export default class InventoriesController {

    async index({ response }): Promise<HttpContextContract> {
        const inventories = await Inventory
            .query()
            .preload('product');
        return response.json(inventories);
    }

    async delete({ response, params, logger }): Promise<HttpContextContract> {
        try {
            const inventory = await Inventory.findOrFail(params.inventoryId);
            await inventory.delete();
            return response.status(200);
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        }
    }

    async update({ request, response, params, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            action: schema.enum(Object.values(StockTransactionEnum)),
            quantity: schema.number([
                rules.unsigned()
              ]),
        });

        const validatedData: StockTransaction = await request.validate({
            schema: validatorSchema,
            messages: {
                'action.required': 'The action is required',
                'action.enum': 'This action doesnt exists',
                'quantity.required': 'The quantity is required',
                'quantity.unsigned': 'The quantity should be positive'
            }
        });

        try {

            if (validatedData.quantity === 0) {
                return response.status(400).json({ message: 'Bad request'});
            }
            const product: Product = await Product.findOrFail(params.productId);
            await product.preload('inventory');
            
            const stockTransaction: StockTransaction = new StockTransaction();
            stockTransaction.action = validatedData.action;
            stockTransaction.quantity = validatedData.quantity;
            stockTransaction.product_uid = product.uid;
            stockTransaction.uid = uuidv4();

            const inventory: Inventory = product.inventory;
            switch(validatedData.action) {
                case StockTransactionEnum.increment:
                    inventory.total += validatedData.quantity;
                    inventory.available += validatedData.quantity;
                    break;
                case StockTransactionEnum.decrement:
                    if (validatedData.quantity > inventory.total) {
                        return response.status(400).json({ message: 'Bad request'});
                    }
                    inventory.total -= validatedData.quantity;
                    inventory.available -= validatedData.quantity;
                    break;  
                case StockTransactionEnum.allocate:
                    if (validatedData.quantity > inventory.available) {
                        return response.status(400).json({ message: 'Bad request'});
                    }
                    inventory.available -= validatedData.quantity;
                    inventory.allocated += validatedData.quantity;
                    break;
                case StockTransactionEnum.deallocate:
                    if (validatedData.quantity > inventory.allocated) {
                        return response.status(400).json({ message: 'Bad request'});
                    }
                    inventory.available += validatedData.quantity;
                    inventory.allocated -= validatedData.quantity;
                    break;
            }

            await inventory.save();
            await stockTransaction.save();
            return response.status(200).json(stockTransaction)
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

}
