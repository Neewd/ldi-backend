import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ProductVariation from 'App/Models/ProductVariation';

export default class ProductVariationsController {

    async save({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.unique({ table: 'product_variations', column: 'name' })
            ])
        });

        const validatedData: ProductVariation = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.required': 'The product variation name is required',
                'name.unique': 'This product variation name is required'
            }
        });

        let productVariation = new ProductVariation();
        productVariation.name = validatedData.name;

        try {
            await productVariation.save();
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }

        return response.json(productVariation);
    }

    async index({ response }): Promise<HttpContextContract> {
        const productVariations = await ProductVariation
            .query()
            .preload('options');
        return response.json(productVariations);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'product_variations', column: 'uid' })
            ]),
            name: schema.string({trim: true})
        });

        const validatedData: ProductVariation = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.required': 'The product variation name is required',
                'name.unique': 'This product variation name is required'
            }
        });

        try {
            const productVariation: ProductVariation = await ProductVariation.findOrFail(validatedData.uid);
            productVariation.name = validatedData.name;
            await productVariation.save();
            return response.status(200).json(productVariation)
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async delete({ response, params, logger }): Promise<HttpContextContract> {
        try {
            const productVariation = await ProductVariation.findOrFail(params.productVariationId)
            await productVariation.delete();
            return response.status(200);
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        }
    }
}
