import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import CalendarRule from 'App/Models/CalendarRule';

export default class CalendarRulesController {

    async save({ request, response, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            number_of_product: schema.number(),
            category_uid: schema.string({trim: true}, [
                rules.exists({ table: 'categories', column: 'uid' })
            ]),
            calendar_uid: schema.string({ trim : true}, [
                rules.exists({ table: 'calendars', column: 'uid' })
            ])
        });

        const validatedData: CalendarRule = await request.validate({
            schema: validatorSchema,
            messages: {
                'number_of_product.required': 'The number of prodcuts is required',
                'category_uid.required': 'The category_uid is required',
                'category_uid.exists': 'The category_uid doesnt exists',
                'calendar_uid.required': 'The calendar_uid is required',
                'calendar_uid.exists': "The calendar_uid doesnt exists"
            }
        });

        let calendarRule = new CalendarRule();
        calendarRule.number_of_product = validatedData.number_of_product;
        calendarRule.calendar_uid = validatedData.calendar_uid;
        calendarRule.category_uid = validatedData.category_uid;

        try {
            await calendarRule.save();
            return response.json(calendarRule);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }

    async index({ response }): Promise<HttpContextContract> {
        const calendarRules = await CalendarRule.all();
        return response.json(calendarRules);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'calendar_rules', column: 'uid' })
            ]),
            number_of_product: schema.number()
        });

        const validatedData: CalendarRule = await request.validate({
            schema: validatorSchema,
            messages: {
                'number_of_product.required': 'The number of prodcuts is required'
            }
        });

        try {
            const calendarRule: CalendarRule = await CalendarRule.findOrFail(validatedData.uid);
            calendarRule.number_of_product = validatedData.number_of_product;
            await calendarRule.save();
            return response.status(200).json(calendarRule)
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
            const calendarRule = await CalendarRule.findOrFail(params.calendarRuleId)
            await calendarRule.delete();
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
