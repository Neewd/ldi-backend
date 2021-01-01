import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CartCalendarStatusEnum } from 'App/Models/Enum/CartCalendarStatusEnum';
import CartCalendar from 'App/Models/CartCalendar';
import Cart from 'App/Models/Cart';
import Product from 'App/Models/Product';
import Event from '@ioc:Adonis/Core/Event'
import { ProductStatusEnum } from 'App/Models/Enum/ProductStatusEnum';

export default class CartsController {

    async attachCalendarToCart({ request, response, auth, params, logger }): Promise<HttpContextContract> {

        const validatorSchema = schema.create({
            status: schema.enum.optional(Object.values(CartCalendarStatusEnum)),
        });

        const validatorParamsSchema = schema.create({
            calendar_uid: schema.string({}, [
                rules.exists({ table: 'calendars', column: 'uid' })
            ]),
            cart_uid: schema.string({}, [
                rules.exists({ table: 'carts', column: 'uid' })
            ])
        })

        const validatedData = await request.validate({
            schema: validatorSchema,
            messages: {
                'status.enum': 'The status doesnt exists',
            }
        });

        const validateDataParams = await validator.validate({
            schema: validatorParamsSchema,
             data: params,
            messages: {
                'calendar_uid.required': 'The calendar id is required',
                'calendar_uid.exists': 'The calendar id doesnt exists',
                'cart_uid.required': 'The cart id is required',
                'cart_uid.exists': 'The cart id doesnt exists',
            } 
        })

        if (validatedData.status === CartCalendarStatusEnum.complete) {
            return response.status(400).json({ message: 'Bad request, cant complete a calendar that easily'});
        }

        try {
            // We need to verify that the connected user is the owner of the cart
            const cart: Cart = await Cart.findOrFail(validateDataParams.cart_uid);
            await cart.preload('user');
            if (cart.user.uid !== auth.user.id) {
                return response.status(401).json('Unauthorized')
            }

            const cartCalendar: CartCalendar = new  CartCalendar();
            cartCalendar.status = CartCalendarStatusEnum.incomplete;
            cartCalendar.cart_uid = validateDataParams.cart_uid;
            cartCalendar.calendar_uid = validateDataParams.calendar_uid;

            await cartCalendar.save();
            return response.status(200).json(cartCalendar)
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                response.status(400).json({message: "Bad request"})
            }
            logger.error(error);
            return response.status(500);
        }
    }

    async attachProductToCartCalendar({ response, params, logger }): Promise<HttpContextContract> {
        try {
            const product = await Product.findOrFail(params.productId);
            const quantity = 1;
            const cartCalendar = await CartCalendar.findOrFail(params.cartCalendarId);
            
            if (product.status === ProductStatusEnum.inactive) {
                return response.status(400).json({ message: 'Bad Request'});
            }

            await product.preload('inventory');
            if (product.inventory.available < quantity) {
                return response.status(400).json({ message: 'Not enough stock'});
            }
            await cartCalendar.related('products').attach({
                [product.uid]: {
                  quantity: quantity,
                }
            })

            // TODO : Here we need to verify the stock and to allocate the stock for this cart
            Event.emit('cart:productAttached', { 
                cartCalendar: cartCalendar,
                product: product
            });
            return response.status(200);
        } catch(error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        }
    }

    async checkout({ response, logger }): Promise<HttpContextContract> {
        try {
            return response.status(500).json({ message : 'Not implemented yet'});
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.status(400).json({message: "Bad request"})
            } 
            logger.error(error);
            return response.status(500);
        }
    }
}

