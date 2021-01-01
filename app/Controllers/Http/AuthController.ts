import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {

    async register({ request, response, logger }) {

        const validatorSchema = schema.create({
            email: schema.string({trim: true}, [
                rules.required(),
                rules.email(),
                rules.maxLength(255),
                rules.unique({ table: 'users', column: 'email' })
            ]),
            password: schema.string({trim: true}, [
                rules.confirmed()
            ]),
        });

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'email.required': 'An email is required to register',
                'email.email': 'The email is not a valid one',
                'email.maxLength': 'The email is too long',
                'email.unique': 'This email exist already',
                'password.confirmed': "The password and the confirmed doesn't match",
            }
        });

        try {
            const user = await User.create(validatedData);
            return response.json(user)
        } catch (error) {
            logger.error(error);
            return response.status(500).json()
        }
    }

    async login({ request, response, auth, logger }) {

        const { email, password } = request.all();

        try {
            const loggedIn = await auth.attempt(email, password );
            return response.json(loggedIn)
        } catch (error) {
            if (error.code === 'E_INVALID_AUTH_UID') {
                return response.json({ message: "This email doesn't exist"});
              }
            
              if (error.code === 'E_INVALID_AUTH_PASSWORD') {
                return response.json({ message: "Password"});
              }
              logger.error(error);
              return response.status(500);
        }

    }

    // TODO :  Make sur this one is secured as fuck
    async deleteAccount({ response, params, auth, logger }) {
        const user = auth.user;
        if (user?.id !== params.userId) {
            return response.status(401).json({ message: 'Unauthorized operation'})
        } 

        try {
            const user = await User.findOrFail(params.userId)
            await user.delete();
            response.status(200)

        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        } 
    }

}
