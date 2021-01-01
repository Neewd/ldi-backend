import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import PromotionService from '@ioc:LaDouceImpatience/PromotionService'
import { PromotionTypeEnum } from 'App/Models/Enum/PromotionTypeEnum';
import Promotion from 'App/Models/Promotion';

export default class PromotionsController {

    async save({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.unique({ table: 'promotions', column: 'name' })
            ]),
            description: schema.string.optional({ trim: true}),
            active: schema.boolean(),
            automatic: schema.boolean(),
            promotion_type: schema.enum(Object.values(PromotionTypeEnum)),
            start: schema.date({
                format: 'yyyy-MM-dd HH:mm:ss',
            }),
            end: schema.date({
                format: 'yyyy-MM-dd HH:mm:ss',
            }),
            schema: schema.object().anyMembers()
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.required': 'The product variation name is required',
                'name.unique': 'This product variation name is required',
                'active.required': 'The active flag is required',
                'automatic.required': 'The automatic flag is required',
                'promotion_type.required': 'The promotion type is required',
                'promotion_type.enum': 'This promotion_type doesnt exists',
                'start.required': 'The start date is required',
                'start.format': 'The start date has the wrong format',
                'end.required': 'The end date is required',
                'end.format': 'The end end date has the wrong format',
                'schema.required': 'The schema is required'
            }
        });

        let promotion = new Promotion();
        promotion.name = validatedData.name;
        promotion.description = validatedData.description;
        promotion.active = validatedData.active;
        promotion.automatic = validatedData.automatic;
        promotion.promotion_type = validatedData.promotion_type;
        promotion.start = validatedData.start;
        promotion.end = validatedData.end;
        promotion.schema = JSON.stringify(validatedData.schema);

        const isFixedDiscount = PromotionService.isFixedDiscount(validatedData.schema);
        const isItemFixedDiscount = PromotionService.isItemFixedDiscount(validatedData.schema);
        const isItemPercentDiscount = PromotionService.isItemPercentDiscount(validatedData.schema);
        const isPercentDiscount = PromotionService.isPercentDiscount(validatedData.schema);
        const isXforYDiscount = PromotionService.isXforYDiscount(validatedData.schema);
        const isXforAmountDiscount = PromotionService.isXforAmountDiscount(validatedData.schema);
        if (!isFixedDiscount && !isItemFixedDiscount && !isItemPercentDiscount && !isPercentDiscount && !isXforYDiscount && !isXforAmountDiscount) {
            return response.status(400).json({ message: 'Bad request'});
        }
        
        try {
            await promotion.save();
            return response.json(promotion);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }

    async index({ response }): Promise<HttpContextContract> {
        const promotions = await Promotion.all();
        return response.json(promotions);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'promotions', column: 'uid' })
            ]),
            name: schema.string({trim: true}),
            description: schema.string.optional({ trim: true}),
            active: schema.boolean(),
            automatic: schema.boolean(),
            promotion_type: schema.enum(Object.values(PromotionTypeEnum)),
            start: schema.date({
                format: 'yyyy-MM-dd HH:mm:ss',
            }),
            end: schema.date({
                format: 'yyyy-MM-dd HH:mm:ss',
            }),
            schema: schema.object().anyMembers()
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': 'The promotions id is required',
                'id.exists': 'The promotions id doesnt exists',
                'name.required': 'The product variation name is required',
                'name.unique': 'This product variation name is required',
                'active.required': 'The active flag is required',
                'automatic.required': 'The automatic flag is required',
                'promotion_type.required': 'The promotion type is required',
                'promotion_type.enum': 'This promotion_type doesnt exists',
                'start.required': 'The start date is required',
                'start.format': 'The start date has the wrong format',
                'end.required': 'The end date is required',
                'end.format': 'The end end date has the wrong format',
                'schema.required': 'The schema is required'
            }
        });

        try {
            const promotion: Promotion = await Promotion.findOrFail(validatedData.id);
            promotion.name = validatedData.name;
            promotion.description = validatedData.description;
            promotion.active = validatedData.active;
            promotion.automatic = validatedData.automatic;
            promotion.promotion_type = validatedData.promotion_type;
            promotion.start = validatedData.start;
            promotion.end = validatedData.end;
            promotion.schema = JSON.stringify(validatedData.schema);

            await promotion.save();
            return response.status(200).json(promotion)
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
            const promotion = await Promotion.findOrFail(params.promotionId)
            await promotion.delete();
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
