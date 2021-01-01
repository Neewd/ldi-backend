// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Address from 'App/Models/Address';

export default class AddressesController {

    async save({ request, response, params, auth, logger }) {

        const user = auth.user;
        if (params.userId !== user?.id) {
            return response.status(401).json('Unauthorized access');
        }

        const validatorSchema = schema.create({
            name: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            first_name: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            last_name: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            phone_number: schema.string({}, [
                rules.mobile({ strict: true })
            ]),
            instructions: schema.string.optional({trim: true}, [
                rules.maxLength(255),
            ]),
            company_name: schema.string.optional({trim: true}, [
                rules.maxLength(255),
            ]),
            line_1: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            line_2: schema.string.optional({trim: true}, [
                rules.maxLength(255),
            ]),
            city: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            country: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            zipcode: schema.string({trim: true}, [
                rules.maxLength(255),
            ]),
            user_uid: schema.string({trim: true}, [
                rules.exists({ table: 'users', column: 'uid' }),
                rules.maxLength(255),
            ])
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'name.required': 'The name of the address is required',
                'name.maxLength': 'The name of the address is too long',
                'first_name.required': 'The first name of the address is required',
                'first_name.maxLength': 'The first name of the address is too long',
                'last_name.required': 'The last name of the address is required',
                'last_name.maxLength': 'The last name of the address is too long',
                'phone_number.required': 'The phone number is required',
                'phone_number.mobile': 'The phone number is not a real one',
                'instructions.maxLength': 'The instructions is too long',
                'company_name.maxLength': 'The company name is too long',
                'line_1.maxLength': 'The line 1 is too long',
                'line_2.maxLength': 'The line 2 is too long',
                'city.required': 'The city is required',
                'city.maxLength': 'The city is too long',
                'country.required': 'The country is required',
                'country.maxLength': 'The country is too long',
                'zipcode.required': 'The zipcode is required',
                'zipcode.maxLength': 'The zipcode is too long',
                'user_uid.required': 'The user_uid is required',
                'user_uid.exists': "The user_uid doesn't exists",
                'user_uid.maxLength': 'The user_uid is too long'
            }
        });

        const address = new Address()
        address.name = validatedData.name;
        address.first_name = validatedData.first_name;
        address.last_name = validatedData.last_name;
        address.phone_number = validatedData.phone_number;
        address.instructions = validatedData.instructions;
        address.company_name = validatedData.company_name;
        address.line_1 = validatedData.line_1;
        address.line_2 = validatedData.line_2;
        address.city = validatedData.city;
        address.country = validatedData.country;
        address.zipcode = validatedData.zipcode;
        address.user_uid = validatedData.user_uid;
        
        try {
            const addresses = await user.related('addresses').saveMany([address])
            return response.json(addresses);
        } catch (error) {
            logger.error(error)
            return response.status(500)
        }

    }

    async index({ response, auth, params }) {
        const user = auth.user;
        if (user.id !== params.userId) {
            return response.status(400).json({message: "Bad request"});
        }
        await user.preload('addresses');
        const addresses = user.addresses
        return response.json(addresses);
    }

    async update({ request, response, auth, params, logger }) {
        const user = auth.user;
        if (user?.id !== params.userId) {
            return response.status(400).json({ message: 'Bad Request'});
        }
        try {
            const validatorSchema = schema.create({
                name: schema.string({trim: true}, [
                    rules.maxLength(255),
                ]),
                first_name: schema.string({trim: true}, [
                    rules.maxLength(255),
                ]),
                last_name: schema.string({trim: true}, [
                    rules.maxLength(255),
                ]),
                phone_number: schema.string({}, [
                    rules.mobile({ strict: true })
                ]),
                instructions: schema.string.optional({trim: true}, [
                    rules.maxLength(255),
                ]),
                company_name: schema.string.optional({trim: true}, [
                    rules.maxLength(255),
                ]),
                line_1: schema.string({trim: true}, [
                    rules.maxLength(255),
                ]),
                line_2: schema.string.optional({trim: true}, [
                    rules.maxLength(255),
                ]),
                city: schema.string({trim: true}, [
                    rules.maxLength(255),
                ]),
                country: schema.string({trim: true}, [
                    rules.maxLength(255),
                ]),
                zipcode: schema.string({trim: true}, [
                    rules.maxLength(255),
                ])
            });
    
            const validatedData = await request.validate({
                schema: validatorSchema,
                messages: {
                    'name.required': 'The name of the address is required',
                    'name.maxLength': 'The name of the address is too long',
                    'first_name.required': 'The first name of the address is required',
                    'first_name.maxLength': 'The first name of the address is too long',
                    'last_name.required': 'The last name of the address is required',
                    'last_name.maxLength': 'The last name of the address is too long',
                    'phone_number.required': 'The phone number is required',
                    'phone_number.mobile': 'The phone number is not a real one',
                    'instructions.maxLength': 'The instructions is too long',
                    'company_name.maxLength': 'The company name is too long',
                    'line_1.maxLength': 'The line 1 is too long',
                    'line_2.maxLength': 'The line 2 is too long',
                    'city.required': 'The city is required',
                    'city.maxLength': 'The city is too long',
                    'country.required': 'The country is required',
                    'country.maxLength': 'The country is too long',
                    'zipcode.required': 'The zipcode is required',
                    'zipcode.maxLength': 'The zipcode is too long'
                }
            });
    
            const address = await Address.findOrFail(params.addressId);
            if (address.user_uid !== user.id) {
                return response.status(401).json({message: "Unauthorized operation"})
            }
            address.name = validatedData.name;
            address.first_name = validatedData.first_name;
            address.last_name = validatedData.last_name;
            address.phone_number = validatedData.phone_number;
            address.instructions = validatedData.instructions;
            address.company_name = validatedData.company_name;
            address.line_1 = validatedData.line_1;
            address.line_2 = validatedData.line_2;
            address.city = validatedData.city;
            address.country = validatedData.country;
            address.zipcode = validatedData.zipcode;
            address.save();
            return response.json(address)
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async delete({ response, params, logger }) {
        try {
            const address = await Address.findOrFail(params.addressId)
            await address.delete();
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
