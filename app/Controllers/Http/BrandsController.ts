import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Brand from 'App/Models/Brand';
import Media from 'App/Models/Media';
import { BrandStatusEnum } from 'App/Models/Enum/BrandStatusEnum';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Application from '@ioc:Adonis/Core/Application';
import fs from 'fs';

export default class BrandsController {

    async save({ request, response, logger }): Promise<HttpContextContract>  {

        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.required(),
                rules.maxLength(255),
                rules.unique({ table: 'brand', column: 'name' })
            ]),
            description: schema.string.optional({}),
            slug: schema.string({}, [
                rules.required(),
                rules.unique({ table: 'brand', column: 'slug' })
            ]),
            status: schema.enum(Object.values(BrandStatusEnum))
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.required': 'The brand name is required',
                'name.unique': 'This brand name is already used',
                'name.maxLength': 'The brand name is too long',
                'description.required': 'The description is required',
                'slug.required': "The slug is required",
                'slug.unique': "This slug is already used",
                'status': "The status doesn't fit the enum property"
            }
        });

        try {
            const brand = await Brand.create(validatedData);
            return response.json(brand);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }

    async index({ response }): Promise<HttpContextContract> {
        const brands = await Brand
            .query()
            .preload('logo');
        return response.json(brands);
    }

    async update({response, request, logger}): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.required(),
                rules.exists({ table: 'brand', column: 'uid' })
            ]),
            name: schema.string({trim: true}, [
                rules.required(),
                rules.maxLength(255),
                rules.unique({ table: 'brand', column: 'name' })
            ]),
            description: schema.string.optional({}),
            slug: schema.string({}, [
                rules.required(),
                rules.unique({ table: 'brand', column: 'slug' })
            ]),
            status: schema.enum(Object.values(BrandStatusEnum))
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': "Id of the brand is required",
                'id.exists': "Id of the brand doesn't exists",
                'name.required': 'The brand name is required',
                'name.unique': 'This brand name is already used',
                'name.maxLength': 'The brand name is too long',
                'description.required': 'The description is required',
                'slug.required': "The slug is required",
                'slug.unique': "This slug is already used",
                'status': "The status doesn't fit the enum property"
            }
        });

        const brand = await Brand.findOrFail(validatedData.id);
        brand.description = validatedData.description;
        brand.name = validatedData.name;
        brand.slug = validatedData.slug;
        brand.status = validatedData.status;

        try {
            await brand.save()
            return response.json(brand);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }
    
    async delete({ response, params, logger }): Promise<HttpContextContract>  {
        try {
            const brand = await Brand.findOrFail(params.brandUid)
            await brand.delete();
            return response.status(200)

        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        } 
    }

    async uploadLogo({ request, response, params, logger }): Promise<HttpContextContract> {
        const validatorParamsSchema = schema.create({
            brandUid: schema.string({trim: true}, [
                rules.exists({ table: 'brands', column: 'uid' })
            ])
        });

        const validatorRequestSchema = schema.create({
            photo: schema.file({
              size: '5mb',
              extnames: ['jpg', 'png', 'jpeg'],
            })
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
                'brandUid.required': 'The brand uid is required',
                'brandUid.exists': 'This brand uid doesnt exists'
            }
        });

        try {
            const brand = await Brand.findOrFail(validatedParamsData.brandUid);
            const uploadFileName = `brands/${brand.uid}/${new Date().getTime()}.${validatedRequestData.photo.extname}`;

            const media: Media = await Media.create({
                url: uploadFileName,
                type: 'media'
            });

            brand.logo_uid = media.uid;
            await brand.save();
        
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

    async deleteLogo({ response, params, logger }): Promise<HttpContextContract> {
        try {
            const media = await Media.findOrFail(params.mediaUid)
            const brand = await Brand.findOrFail(params.brandUid)

            brand.logo_uid = '';
            await brand.save();

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
