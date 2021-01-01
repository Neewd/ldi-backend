import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category';
import { CategoriesStatusEnum } from 'App/Models/Enum/CategoriesStatusEnum';

export default class CategoriesController {

    async save({ request, response, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.maxLength(255),
                rules.unique({ table: 'categories', column: 'name' })
            ]),
            slug: schema.string({}, [
                rules.maxLength(255),
                rules.unique({ table: 'categories', column: 'slug' })
            ]),
            description: schema.string.optional({ trim : true}),
            status: schema.enum(Object.values(CategoriesStatusEnum)),
            parent_uid: schema.string.optional({trim: true}, [
                rules.exists({ table: 'categories', column: 'uid' })
            ])
        });

        const validatedData: Category = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.unique': 'The category name is already used',
                'name.maxLength': 'The category name is too long',
                'name.required': 'The category name is required',
                'slug.unique': 'The category slug is already used',
                'slug.maxLength': 'The category slug is too long',
                'slug.required': 'The category slug is required',
                'status.required': "The status is required",
                'status.enum': "The status doesn't fit the enum property",
                'parent_uid.unique': "The parent id doesn't exist"
            }
        });

        let category = new Category();
        category.name = validatedData.name;
        category.slug = validatedData.slug;
        category.description = validatedData.description;
        category.status = validatedData.status;
        category.parent_uid = validatedData.parent_uid;

        try {
            await category.save();
            return response.json(category);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }

    async index({ response }): Promise<HttpContextContract> {
        const categories = await Category
            .query()
            .preload('child_categories')
            .preload('parent_category')
            .preload('products')
        return response.json(categories);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'categories', column: 'uid' })
            ]),
            name: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            slug: schema.string({}, [
                rules.maxLength(255),
            ]),
            description: schema.string.optional({ trim : true}),
            status: schema.enum(Object.values(CategoriesStatusEnum)),
            parent_uid: schema.string.optional({trim: true}, [
                rules.exists({ table: 'categories', column: 'uid' })
            ])
        });

        const validatedData: Category = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': "The category id is required",
                "id.exists": "The category id doesnt exists",
                'name.unique': 'The category name is already used',
                'name.maxLength': 'The category name is too long',
                'name.required': 'The category name is required',
                'slug.unique': 'The category slug is already used',
                'slug.maxLength': 'The category slug is too long',
                'slug.required': 'The category slug is required',
                'status.required': "The status is required",
                'status.enum': "The status doesn't fit the enum property",
                'parent_uid.unique': "The parent id doesn't exist"
            }
        });
        let category: Category;
        try {
            category = await Category.findOrFail(validatedData.uid);
            category.name = validatedData.name;
            category.slug = validatedData.slug;
            category.description = validatedData.description;
            category.status = validatedData.status;
            category.parent_uid = validatedData.parent_uid;
            
            await category.save();
            return response.json(category);
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async delete({ response, params, logger }): Promise<HttpContextContract> {
        try {
            const category: Category = await Category.findOrFail(params.categoryId)
            // We need to detach potential products 
            await category.related('products').detach();
            await category.delete();
            return response.status(200)
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        }
    }
}
