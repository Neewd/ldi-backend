import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Calendar from 'App/Models/Calendar';
import Currency from 'App/Models/Currency';
import Media from 'App/Models/Media';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CurrencyFormatterService from '@ioc:LaDouceImpatience/CurrencyFormatterService'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application';
import fs from 'fs'

export default class CalendarsController {

    async save({ request, response, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.maxLength(255),
                rules.unique({ table: 'calendars', column: 'name' })
            ]),
            sku: schema.string({}, [
                rules.maxLength(255),
                rules.unique({ table: 'calendars', column: 'sku' })
            ]),
            slug: schema.string({}, [
                rules.maxLength(255),
                rules.unique({ table: 'calendars', column: 'slug' })
            ]),
            price_with_tax_amount: schema.number([
                rules.requiredIfNotExistsAll(['price_without_tax_amount', 'price_tax']),
            ]),
            price_with_tax_currency: schema.string({}, [
                rules.exists({ table: 'currencies', column: 'code' }),
                rules.requiredIfNotExistsAll(['price_without_tax_amount', 'price_tax']),
            ]),
            price_without_tax_amount: schema.number.optional([
                rules.requiredIfExistsAll(['price_tax'])
            ]),
            price_without_tax_currency: schema.string.optional({}, [
                rules.requiredIfExistsAll(['price_tax'])
            ]),
            price_tax: schema.number.optional(),
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.unique': 'The calendar name is already used',
                'name.maxLength': 'The calendar name is too long',
                'name.required': 'The calendar name is required',
                'sku.unique': 'The calendar sku is already used',
                'sku.maxLength': 'The calendar sku is too long',
                'sku.required': 'The calendar sku is required',
                'slug.unique': 'The calendar slug is already used',
                'slug.maxLength': 'The calendar slug is too long',
                'slug.required': 'The calendar slug is required',
                'price_with_tax_amount.requiredIfNotExistsAll': "The price with tax amount is required if the tax is not present",
                'price_with_tax_currency.required': "The price with tax currency is required",
                'price_with_tax_currency.exists': "The price with tax currency is not a valid one",
                'price_with_tax_currency.requiredIfNotExistsAll': "The price with tax currency is required if price tax doesn't exists",
                'price_without_tax_currency.required': "The price without tax currency is required",
                'price_without_tax_currency.exists': "The price without tax currency is not a valid one",
                'price_without_tax_currency.requiredIfNotExistsAll': "The price without tax currency is required if price tax doesn't exists",
                'price_without_tax_amount.requiredIfExistsAll': "The price price without tax is required if the price tax is here" 
            }
        });

        const calendar = new Calendar();
        calendar.name = validatedData.name;
        calendar.sku = validatedData.sku;
        calendar.slug = validatedData.slug;
        
        try {
            let currency: Currency; 
            if (validatedData.price_without_tax_currency) {
                currency = await Currency.findByOrFail('code', validatedData.price_without_tax_currency);
            } else {
                currency = await Currency.findByOrFail('code', validatedData.price_with_tax_currency);
            }

            // If we have a tax, we must compute the "with_tax" amount
            if (validatedData.price_tax) {
                calendar.price_without_tax_currency = currency.code;
                calendar.price_with_tax_currency = currency.code;
                calendar.price_without_tax_amount = validatedData.price_without_tax_amount;
                calendar.price_without_tax_formatted = CurrencyFormatterService.format(validatedData.price_without_tax_amount, currency);
                calendar.price_with_tax_amount = validatedData.price_without_tax_amount * validatedData.price_tax;
                calendar.price_with_tax_formatted = CurrencyFormatterService.format(validatedData.price_with_tax_amount, currency);
            } else {
                calendar.price_with_tax_currency = currency.code;
                calendar.price_with_tax_amount = validatedData.price_with_tax_amount;
                calendar.price_with_tax_formatted = CurrencyFormatterService.format(validatedData.price_with_tax_amount, currency);
            }
            await calendar.save();
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        }

        return response.json(calendar)
    }

    async index({ response }) {
        const calendars = await Calendar
            .query()
            .preload('medias', query => {
                query.pivotColumns(['main_media'])
            });
        return response.json(calendars);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'calendars', column: 'uid' })
            ]),
            name: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            sku: schema.string({}, [
                rules.maxLength(255),
            ]),
            slug: schema.string({}, [
                rules.maxLength(255),
            ]),
            price_with_tax_amount: schema.number([
                rules.requiredIfNotExistsAll(['price_without_tax_amount', 'price_tax']),
            ]),
            price_with_tax_currency: schema.string({}, [
                rules.exists({ table: 'currencies', column: 'code' }),
                rules.requiredIfNotExistsAll(['price_without_tax_amount', 'price_tax']),
            ]),
            price_without_tax_amount: schema.number.optional([
                rules.requiredIfExistsAll(['price_tax'])
            ]),
            price_without_tax_currency: schema.string.optional({}, [
                rules.exists({ table: 'currencies', column: 'code' }),
                rules.requiredIfExistsAll(['price_tax'])
            ]),
            price_tax: schema.string.optional(),
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': "The calendar id is required",
                'id.exists': "The calendar id doesn't exists",
                'name.maxLength': 'The calendar name is too long',
                'name.required': 'The calendar name is required',
                'sku.maxLength': 'The calendar sku is too long',
                'sku.required': 'The calendar sku is required',
                'slug.maxLength': 'The calendar slug is too long',
                'slug.required': 'The calendar slug is required',
                'price_with_tax_amount.requiredIfNotExistsAll': "The price with tax amount is required if the tax is not present",
                'price_with_tax_currency.required': "The price with tax currency is required",
                'price_with_tax_currency.exists': "The price with tax currency is not a valid one",
                'price_with_tax_currency.requiredIfNotExistsAll': "The price with tax currency is required if price tax doesn't exists",
                'price_without_tax_currency.required': "The price without tax currency is required",
                'price_without_tax_currency.exists': "The price without tax currency is not a valid one",
                'price_without_tax_currency.requiredIfNotExistsAll': "The price without tax currency is required if price tax doesn't exists",
                'price_without_tax_amount.requiredIfExistsAll': "The price price without tax is required if the price tax is here" 
            }
        });

        try {
            const calendar: Calendar = await Calendar.findOrFail(validatedData.id);
            let currency: Currency; 
            if (validatedData.price_without_tax_currency) {
                currency = await Currency.findByOrFail('code', validatedData.price_without_tax_currency);
            } else {
                currency = await Currency.findByOrFail('code', validatedData.price_with_tax_currency);
            }

            calendar.name = validatedData.name;
            calendar.sku = validatedData.sku;
            calendar.slug = validatedData.slug;

            // If we have a tax, we must compute the "with_tax" amount
            if (validatedData.price_tax) {
                calendar.price_without_tax_currency = currency.code;
                calendar.price_with_tax_currency = currency.code;
                calendar.price_without_tax_amount = validatedData.price_without_tax_amount;
                calendar.price_without_tax_formatted = CurrencyFormatterService.format(validatedData.price_without_tax_amount, currency);
                calendar.price_with_tax_amount = validatedData.price_without_tax_amount * validatedData.price_tax;
                calendar.price_with_tax_formatted = CurrencyFormatterService.format(validatedData.price_with_tax_amount, currency);
            } else {
                calendar.price_with_tax_currency = currency.code;
                calendar.price_with_tax_amount = validatedData.price_with_tax_amount;
                calendar.price_with_tax_formatted = CurrencyFormatterService.format(validatedData.price_with_tax_amount, currency);
            }
            await calendar.save();
            return response.json(calendar);
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async delete({ response, params, logger }): Promise<HttpContextContract> {
        try {
            const calendar: Calendar = await Calendar.findOrFail(params.calendarId)
            await calendar.delete();
            return response.status(200)

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
            calendarUid: schema.string({trim: true}, [
                rules.exists({ table: 'calendars', column: 'uid' })
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
                'calendarUid.required': 'The calendar uid is required',
                'calendarUid.exists': 'This calendar uid doesnt exists',
                'mainMedia.required': 'The main media is required'
            }
        });

        try {
            const calendar = await Calendar.findOrFail(validatedParamsData.calendarUid);
            const uploadFileName = `calendars/${calendar.uid}/${new Date().getTime()}.${validatedRequestData.photo.extname}`;

            if (validatedRequestData.mainMedia) {
                // We update all the medias for this product uid to main_media = false
                await Database
                    .from('calendar_medias')
                    .where('calendar_uid', calendar.uid)
                    .update({ main_media: false })
            }
            const media: Media = await Media.create({
                url: uploadFileName,
                type: 'media'
            });

            await calendar.related('medias').attach({
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
            const calendar = await Calendar.findOrFail(params.calendarUid)
            // We need to detach the medias from the calendar 
            await calendar.related('medias').detach([media.uid]);

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
