import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import PromotionCode from 'App/Models/PromotionCode';

export default class PromotionCodesController {

    async save({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            uses: schema.number(),
            code: schema.string({trim: true}, [
                rules.minLength(5)
            ]),
            user_uid: schema.string.optional({trim: true}, [
                rules.exists({ table: 'users', column: 'uid'})
            ]),
            promotion_uid: schema.string({trim: true}, [
                rules.exists({ table: 'promotions', column: 'uid'})
            ])
        });

        const validatedData: PromotionCode = await request.validate({
            schema: validatorSchema,
            messages: {
                'uses.required': 'The uses is required',
                'user_uid.exists': 'The user_uid doesnt exists',
                'code.required': 'The code is required',
                'code.minLength': 'The code should be 5 length at least',
                'promotion_uid.required': 'The promotion_uid is required',
                'promotion_uid.exists': 'The promotion_uid doesnt exists'
            }
        });

        let promotionCode = new PromotionCode();
        promotionCode.uses = validatedData.uses;
        promotionCode.code = validatedData.code;
        promotionCode.user_uid = validatedData.user_uid;
        promotionCode.promotion_uid = validatedData.promotion_uid;

        try {
            await promotionCode.save();
            return response.json(promotionCode);
        } catch (error) {
            logger.error(error);
            return response.status(500);
        }
    }

    async index({ response }): Promise<HttpContextContract> {
        const promotionCodes = await PromotionCode.all();
        return response.json(promotionCodes);
    }

    async update({ request, response, logger }): Promise<HttpContextContract> {
        const validatorSchema = schema.create({
            id: schema.string({trim: true}, [
                rules.exists({ table: 'promotion_codes', column: 'uid'})
            ]),
            uses: schema.number(),
            code: schema.string({trim: true}, [
                rules.minLength(5)
            ]),
            user_uid: schema.string.optional({trim: true}, [
                rules.exists({ table: 'users', column: 'uid'})
            ]),
            promotion_uid: schema.string({trim: true}, [
                rules.exists({ table: 'promotions', column: 'uid'})
            ])
        });

        const validatedData: PromotionCode = await request.validate({
            schema: validatorSchema,
            messages: {
                'id.required': 'The id is required',
                'id.exists': 'The id doesnt exists',
                'uses.required': 'The uses is required',
                'code.required': 'The code is required',
                'code.minLength': 'The code should be 5 length at least',
                'user_uid.exists': 'The user_uid doesnt exists',
                'promotion_uid.required': 'The promotion_uid is required',
                'promotion_uid.exists': 'The promotion_uid doesnt exists'
            }
        });

        try {
            const promotionCode: PromotionCode = await PromotionCode.findOrFail(validatedData.uid);
            promotionCode.uses = validatedData.uses;
            promotionCode.code = validatedData.code;
            promotionCode.user_uid = validatedData.user_uid;
            promotionCode.promotion_uid = validatedData.promotion_uid;

            await promotionCode.save();
            return response.status(200).json(promotionCode)
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
            const promotionCode = await PromotionCode.findOrFail(params.promotionCodeId)
            await promotionCode.delete();
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
