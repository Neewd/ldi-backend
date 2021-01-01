import User from 'App/Models/User';

export default class UsersController {

    async me({ response, auth }) {
        const user = auth.user;
        await user.preload('addresses');
        await user.preload('cart', async (cart) => {
            await cart.preload('cartCalendars', async (cartCalendar) => {
                await cartCalendar.preload('products', (query) => {
                    query.pivotColumns(['quantity'])
                })
            })
        });

        return response.json(user)
    }

    // Absolutely secure this one
    async index({ response }) {
        const users = await User.all();
        response.json(users);
    }

}
