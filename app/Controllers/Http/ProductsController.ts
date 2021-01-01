import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category';
import { ProductStatusEnum } from 'App/Models/Enum/ProductStatusEnum';
import Product from 'App/Models/Product';
import Application from '@ioc:Adonis/Core/Application';
import Media from 'App/Models/Media';
import Database from '@ioc:Adonis/Lucid/Database'
import fs from 'fs'

export default class ProductsController {

    async index({ response }): Promise<HttpContextContract> {
        const products = await Product
            .query()
            .preload('inventory')
            .preload('stockTransactions')
            .preload('medias', query => {
                query.pivotColumns(['main_media'])
            })
        return response.json(products); 
    }

    async save({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.unique({ table: 'products', column: 'name' })
            ]),
            slug: schema.string({trim: true}, [
                rules.maxLength(255),
                rules.unique({ table: 'products', column: 'slug' })
            ]),
            sku: schema.string({trim: true}, [
                rules.maxLength(255),
                rules.unique({ table: 'products', column: 'sku' })
            ]),
            description: schema.string({trim: true}),
            status: schema.enum(Object.values(ProductStatusEnum)),
            brand_uid: schema.string.optional({trim: true}, [
                rules.exists({ table: 'brands', column: 'uid' })
            ]),
            parent_uid: schema.string.optional({trim: true}, [
                rules.exists({ table: 'products', column: 'uid' })
            ]),
        });

        const validatedData: Product = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.required': 'The product name is required',
                'name.unique': 'The product name already exists',
                'slug.required': 'The product slug is required',
                'slug.maxLength': 'The product slug is too long',
                'slug.unique': 'The product slug already exists',
                'sku.required': 'The product sku is required',
                'sku.maxLength': 'The product sku is too long',
                'sku.unique': 'The product sku already exists',
                'description.required': 'The product description is required',
                'status.required': 'This product status is required',
                'status.enum': 'This product status doesnt fit the good enum',
                'brand_uid.required': 'The product brand_uid is required',
                'brand_uid.exists': 'This product brand_uid doesnt exists',
                'parent_uid.required': 'The product parent_uid is required',
                'parent_uid.exists': 'This product parent_uid doesnt exists'
            }
        });

        let product: Product = new Product();
        product.name = validatedData.name;
        product.slug = validatedData.slug;
        product.sku = validatedData.sku;
        product.description = validatedData.description;
        product.status = validatedData.status;
        product.brand_uid = validatedData.brand_uid;
        product.parent_uid = validatedData.parent_uid;

        try {
            await product.save();
            return response.json(product);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'products', column: 'uid' })
            ]),
            name: schema.string({trim: true}),
            slug: schema.string({trim: true}, [
                rules.maxLength(255)
            ]),
            sku: schema.string({trim: true}, [
                rules.maxLength(255)
            ]),
            description: schema.string({trim: true}),
            status: schema.enum(Object.values(ProductStatusEnum)),
            brand_uid: schema.string.optional({trim: true}, [
                rules.exists({ table: 'brands', column: 'uid' })
            ]),
            category_uid: schema.string({trim: true}, [
                rules.exists({ table: 'categories', column: 'uid' })
            ]),
        });

        const validatedData: Product = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': 'The product id is required',
                'id.exists': 'The product id doesnt exists',
                'name.required': 'The product name is required',
                'slug.required': 'The product slug is required',
                'slug.maxLength': 'The product slug is too long',
                'sku.required': 'The product sku is required',
                'sku.maxLength': 'The product sku is too long',
                'description.required': 'The product description is required',
                'status.required': 'This product status is required',
                'status.enum': 'This product status doesnt fit the good enum',
                'brand_uid.required': 'The product brand_uid is required',
                'brand_uid.exists': 'This product brand_uid doesnt exists',
                'parent_uid.required': 'The product parent_uid is required',
                'parent_uid.exists': 'This product parent_uid doesnt exists'
            }
        });
        

        try {
            const product: Product = await Product.findOrFail(validatedData.uid);
            product.name = validatedData.name;
            product.slug = validatedData.slug;
            product.sku = validatedData.sku;
            product.description = validatedData.description;
            product.status = validatedData.status;
            product.brand_uid = validatedData.brand_uid;
            product.parent_uid = validatedData.parent_uid;

            await product.save();
            return response.status(200).json(product)
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async delete({ params, response, logger }): Promise<HttpContextContract> {
        try {
            const product = await Product.findOrFail(params.productId)
            // We need to detach potential categories 
            await product.related('categories').detach();
            await product.delete();
            return response.status(200);
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async attachProductToCategory({ params, response, logger }): Promise<HttpContextContract> {
        try {
            const product = await Product.findOrFail(params.productId);
            const category = await Category.findOrFail(params.categoryId);
            
            await category.related('products').save(product);
            return response.status(200);
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        }
    }

    async uploadPhoto({ request, response, params, logger }): Promise<HttpContextContract> {
        
        const validatorParamsSchema = schema.create({
            productUid: schema.string({trim: true}, [
                rules.exists({ table: 'products', column: 'uid' })
            ])
        });

        const validatorRequestSchema = schema.create({
            photo: schema.file({
              size: '5mb',
              extnames: ['jpg', 'png', 'jpeg'],
            }),
            mainMedia: schema.boolean()
        });

        const validatedRequestData = await request.validate({
            schema: validatorRequestSchema,
            messages: {
                'photo.file.extname': 'You can only upload images',
                'photo.file.size': 'Image size must be under 5mb',
            }
        });

        const validatedParamsData = await validator.validate({
            schema: validatorParamsSchema,
            data: params,
            messages: {
                'productUid.required': 'The product id is required',
                'productUid.exists': 'This product id doesnt exists',
                'mainMedia.required': 'The main media is required'
            }
        });

        try {
            const product = await Product.findOrFail(validatedParamsData.productUid);
            const uploadFileName = `products/${product.uid}/${new Date().getTime()}.${validatedRequestData.photo.extname}`;

            if (validatedRequestData.mainMedia) {
                // We update all the medias for this product uid to main_media = false
                await Database
                    .from('product_medias')
                    .where('product_uid', product.uid)
                    .update({ main_media: false })
            }
            const media: Media = await Media.create({
                url: uploadFileName,
                type: 'media'
            });

            await product.related('medias').attach({
                [media.uid]: {
                    main_media: validatedRequestData.mainMedia
                }  
            });
        
            await validatedRequestData.photo.move(Application.tmpPath('uploads'), {
                name: uploadFileName,
            });
            return response.json();
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async deletePhoto({ response, params, logger }): Promise<HttpContextContract> {
        try {
            const media = await Media.findOrFail(params.mediaUid)
            const product = await Product.findOrFail(params.productUid)
            // We need to detach the medias from the product 
            await product.related('medias').detach([media.uid]);

            // We need to delete the file
            fs.unlinkSync('tmp/uploads/' + media.url)

            await media.delete();
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
