import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { ProductModifierEnum } from 'App/Models/Enum/ProductModifierEnum';
import ProductModifier from 'App/Models/ProductModifier';

export default class ProductModifiersController {

    async save({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            name_equals: schema.boolean.optional(),
            name_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            name_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            description_equals: schema.boolean.optional(),
            description_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            description_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            slug_equals: schema.boolean.optional(),
            slug_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            slug_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            sku_equals: schema.boolean.optional(),
            sku_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            sku_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            price_equals: schema.boolean.optional(),
            price_increment: schema.number.optional(),
            price_decrement: schema. number.optional(),
            status: schema.enum(Object.values(ProductModifierEnum)),
            product_option_uid: schema.string({ trim: true}, [
                rules.exists({ table: 'product_options', column: 'uid' })
            ])
        });

        const validatedData: ProductModifier = await request.validate({
            schema: validatorSchema,
            messages: {
                'name_append.maxLength': 'The name_append is too long',
                'name_prepend.maxLength': 'The name_prepend is too long',
                'description_append.maxLength': 'The description_append is too long',
                'description_prepend.maxLength': 'The description_prepend is too long',
                'slug_append.maxLength': 'The slug_append is too long',
                'slug_prepend.maxLength': 'The slug_prepend is too long',
                'sku_append.maxLength': 'The sku_append is too long',
                'sku_prepend.maxLength': 'The sku_prepend is too long',
                'product_option_uid.required': 'The product option id is required',
                'product_option_uid.exists': 'The product option id doesnt exists',
                'status.required': 'The status is required',
                'status.enum': 'The status is not a good one',
            }   
        });

        let productModifier = new ProductModifier();
        productModifier.name_equals = validatedData.name_equals;
        productModifier.name_append = validatedData.name_append;
        productModifier.name_prepend = validatedData.name_prepend;
        productModifier.description_equals = validatedData.description_equals;
        productModifier.description_append = validatedData.description_append;
        productModifier.description_prepend = validatedData.description_prepend;
        productModifier.description_equals = validatedData.description_equals;
        productModifier.description_append = validatedData.description_append;
        productModifier.description_prepend = validatedData.description_prepend;
        productModifier.slug_equals = validatedData.slug_equals;
        productModifier.slug_append = validatedData.slug_append;
        productModifier.slug_prepend = validatedData.slug_prepend;
        productModifier.sku_equals = validatedData.sku_equals;
        productModifier.sku_append = validatedData.sku_append;
        productModifier.sku_prepend = validatedData.sku_prepend;
        productModifier.price_equals = validatedData.price_equals;
        productModifier.price_increment = validatedData.price_increment;
        productModifier.price_decrement = validatedData.price_decrement;
        productModifier.status = validatedData.status;
        productModifier.product_option_uid = validatedData.product_option_uid;

        try {
            await productModifier.save();
            return response.json(productModifier);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }

    async index({ response }): Promise<HttpContextContract> {
        const productModifiers = await ProductModifier.all();
        return response.json(productModifiers);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'product_modifiers', column: 'uid' })
            ]),
            name_equals: schema.boolean.optional(),
            name_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            name_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            description_equals: schema.boolean.optional(),
            description_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            description_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            slug_equals: schema.boolean.optional(),
            slug_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            slug_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            sku_equals: schema.boolean.optional(),
            sku_append: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            sku_prepend: schema.string.optional({trim: true}, [
                rules.maxLength(255)
            ]),
            price_equals: schema.boolean.optional(),
            price_increment: schema.number.optional(),
            price_decrement: schema. number.optional(),
            status: schema.enum(Object.values(ProductModifierEnum)),
            product_option_uid: schema.string({ trim: true}, [
                rules.exists({ table: 'product_options', column: 'uid' })
            ])
        });

        const validatedData: ProductModifier = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': 'The product modifier id is required',
                'id.exists': 'This product modifier id doesnt exists',
                'name_append.maxLength': 'The name_append is too long',
                'name_prepend.maxLength': 'The name_prepend is too long',
                'description_append.maxLength': 'The description_append is too long',
                'description_prepend.maxLength': 'The description_prepend is too long',
                'slug_append.maxLength': 'The slug_append is too long',
                'slug_prepend.maxLength': 'The slug_prepend is too long',
                'sku_append.maxLength': 'The sku_append is too long',
                'sku_prepend.maxLength': 'The sku_prepend is too long',
                'product_option_uid.required': 'The product option id is required',
                'product_option_uid.exists': 'The product option id doesnt exists'
            }
        });

        try {
            const productModifier: ProductModifier = await ProductModifier.findOrFail(validatedData.uid);
            productModifier.name_equals = validatedData.name_equals;
            productModifier.name_append = validatedData.name_append;
            productModifier.name_prepend = validatedData.name_prepend;
            productModifier.description_equals = validatedData.description_equals;
            productModifier.description_append = validatedData.description_append;
            productModifier.description_prepend = validatedData.description_prepend;
            productModifier.description_equals = validatedData.description_equals;
            productModifier.description_append = validatedData.description_append;
            productModifier.description_prepend = validatedData.description_prepend;
            productModifier.slug_equals = validatedData.slug_equals;
            productModifier.slug_append = validatedData.slug_append;
            productModifier.slug_prepend = validatedData.slug_prepend;
            productModifier.sku_equals = validatedData.sku_equals;
            productModifier.sku_append = validatedData.sku_append;
            productModifier.sku_prepend = validatedData.sku_prepend;
            productModifier.price_equals = validatedData.price_equals;
            productModifier.price_increment = validatedData.price_increment;
            productModifier.price_decrement = validatedData.price_decrement;
            productModifier.status = validatedData.status;
            productModifier.product_option_uid = validatedData.product_option_uid;
            await productModifier.save();
            return response.status(200).json(productModifier)
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
            const productModifier = await ProductModifier.findOrFail(params.productModifierId)
            await productModifier.delete();
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
