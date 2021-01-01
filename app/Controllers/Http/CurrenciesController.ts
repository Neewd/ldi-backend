import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Currency from 'App/Models/Currency';
import Database from '@ioc:Adonis/Lucid/Database';

export default class CurrenciesController {

    async save({ request, response, logger }) {

        const validatorSchema = schema.create({
            code: schema.string({trim: true}, [
                rules.required(),
                rules.maxLength(3),
                rules.unique({ table: 'currencies', column: 'code' })
            ]),
            format: schema.string(),
            decimal_point: schema.string(),
            thousand_separator: schema.string({}, [
                rules.maxLength(1)
            ]),
            decimal_places: schema.number(),
            default: schema.boolean(),
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'code.required': 'The currency code is required',
                'code.unique': 'This currency code is already used',
                'code.maxLength': 'The currency code is too long',
                'format.required': 'The format is required',
                'decimal_point.required': "The decimal point is required",
                'decimal_places.required': "The decimal places is required",
                'thousand_separator.required': "The thousand operator is required",
                'thousand_separator.maxLength': "The thousand operator is too long",
                'default': "The default is already existing"
            }
        });

        // Before creating a new one we need to set all other currencies to default: false if the one we want to create is default. 
        if (validatedData.default) {
            const defaultCurrency: Currency = await Database.from('currencies').where('default', '=', validatedData.default).first();
            if (defaultCurrency) {
                if (defaultCurrency.uid !== validatedData.uid) {
                    return response.status(400).json({message: 'There is already one default value'})
                }
            }
        }

        try {
            const currency = await Currency.create(validatedData);
            return response.json(currency);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }
 
    async index({ response }) {
        const currencies = await Currency.all();
        return response.json(currencies);
    }

    async update({ response, request, logger }) {

        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.required(),
                rules.exists({ table: 'currencies', column: 'uid' })
            ]),
            code: schema.string({trim: true}, [
                rules.required(),
                rules.maxLength(3),
            ]),
            format: schema.string(),
            decimal_point: schema.string(),
            thousand_separator: schema.string({}, [
                rules.maxLength(1)
            ]),
            decimal_places: schema.number(),
            default: schema.boolean(),
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': "The currency id is required",
                'id.exists': "The currency doesn't exists",
                'code.required': 'The currency code is required',
                'code.unique': 'This currency code is already used',
                'code.maxLength': 'The currency code is too long',
                'format.required': 'The format is required',
                'decimal_point.required': "The decimal point is required",
                'decimal_places.required': "The decimal places is required",
                'thousand_separator.required': "The thousand operator is required",
                'thousand_separator.maxLength': "The thousand operator is too long",
                'default': "The default is already existing"
            }
        });

        // We need to verify manually that we won't have two same code on the database. 
        const currencyWithSameCode: Currency = await Database.from('currencies').where('code', '=', validatedData.code).first();
        if (currencyWithSameCode.uid !== validatedData.uid) {
            return response.status(400).json({message: 'This currency code already exist'})
        }

        // We need to now verify that there is not default values other than this one
        if (validatedData.default) {
            const defaultCurrency: Currency = await Database.from('currencies').where('default', '=', validatedData.default).first();
            if (defaultCurrency.uid !== validatedData.uid) {
                return response.status(400).json({message: 'There is already one default value'})
            }
        }

        const currency: Currency = await Currency.findOrFail(validatedData.uid);
        currency.code = validatedData.code;
        currency.format = validatedData.format;
        currency.thousand_separator = validatedData.thousand_separator;
        currency.decimal_point = validatedData.decimal_point;
        currency.decimal_places = validatedData.decimal_places;
        currency.default = validatedData.default;

        try {
            await currency.save();
            return response.json(currency);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }
    
    async delete({ response, params, logger }) {
        try {
            const currency: Currency = await Currency.findOrFail(params.currencyId)
            await currency.delete();
            return response.status(200)
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        } 
    } 

}
