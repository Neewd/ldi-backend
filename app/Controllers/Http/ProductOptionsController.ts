import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ProductOption from 'App/Models/ProductOption';

export default class ProductOptionsController {

    async save({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.unique({ table: 'product_options', column: 'name' })
            ]),
            description: schema.string.optional({trim: true}),
            product_variation_uid: schema.string({ trim: true}, [
                rules.exists({ table: 'product_variations', column: 'uid' })
            ])
        });

        const validatedData: ProductOption = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.required': 'The product options name is required',
                'name.unique': 'This product options name is required',
                'product_variation_uid.required': " The product variation id is required", 
                'product_variation_uid.exists': 'The product variation id doesnt exists'
            }
        });

        let productOption = new ProductOption();
        productOption.name = validatedData.name;
        productOption.description = validatedData.description;
        productOption.product_variation_uid = validatedData.product_variation_uid;

        try {
            await productOption.save();
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }

        return response.json(productOption);
    }

    async index({ response }): Promise<HttpContextContract> {
        const productOptions = await ProductOption.all();
        return response.json(productOptions);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'product_options', column: 'uid' })
            ]),
            name: schema.string({trim: true}),
            description: schema.string.optional({trim: true}),
            product_variation_uid: schema.string({ trim: true}, [
                rules.exists({ table: 'product_variations', column: 'uid' })
            ])
        });

        const validatedData: ProductOption = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': 'The product options id is required',
                'id.exists': 'This product options id is required',
                'name.required': 'The product options name is required',
                'name.unique': 'This product options name is required',
                'product_variation_uid.required': " The product variation id is required", 
                'product_variation_uid.exists': 'The product variation id doesnt exists'
            }
        });

        try {
            const productOption: ProductOption = await ProductOption.findOrFail(validatedData.uid);
            productOption.name = validatedData.name;
            productOption.description = validatedData.description;
            await productOption.save();
            return response.status(200).json(productOption)
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
            const productOption = await ProductOption.findOrFail(params.productOptionId)
            await productOption.delete();
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
