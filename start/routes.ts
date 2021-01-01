/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  // Auth
  Route.post('/register', 'AuthController.register');
  Route.post('/login', 'AuthController.login');
  Route.delete('/user/:userId', 'AuthController.deleteAccount');
  // TODO : Implement forgot password as well

  // User
  Route.get('/me', 'UsersController.me').middleware('auth');
  Route.get('/users', 'UsersController.index');

  // Address
  Route.post('/users/:userId/address', 'AddressesController.save').middleware('auth');
  Route.get('/user/:userId/addresses', 'AddressesController.index').middleware('auth');
  Route.delete('/user/:userId/address/:addressId', 'AddressesController.delete').middleware('auth');
  Route.put('/user/:userId/address/:addressId', 'AddressesController.update').middleware('auth');

  // Brand 
  Route.get('/brands', 'BrandsController.index');
  Route.post('/brand', 'BrandsController.save');
  Route.put('/brand', 'BrandsController.update');
  Route.delete('/brand/:brandUid', 'BrandsController.delete');
  Route.post('/brand/:brandUid/media', 'BrandsController.uploadLogo').middleware('auth');
  Route.delete('/brand/:brandUid/media/:mediaUid', 'BrandsController.deleteLogo').middleware('auth');

  // Calendar 
  Route.get('/calendars', 'CalendarsController.index').middleware('auth');
  Route.post('/calendar', 'CalendarsController.save').middleware('auth');
  Route.put('/calendar', 'CalendarsController.update').middleware('auth');
  Route.delete('/calendar/:calendarId', 'CalendarsController.delete').middleware('auth');

  // Calendar Rules 
  Route.get('/calendarRules', 'CalendarRulesController.index').middleware('auth');
  Route.post('/calendarRule', 'CalendarRulesController.save').middleware('auth');
  Route.put('/calendarRule', 'CalendarRulesController.update').middleware('auth');
  Route.delete('/calendarRule/:calendarRuleId', 'CalendarRulesController.delete').middleware('auth');

  // Category 
  Route.get('/categories', 'CategoriesController.index').middleware('auth');
  Route.post('/category', 'CategoriesController.save').middleware('auth');
  Route.put('/category', 'CategoriesController.update').middleware('auth');
  Route.delete('/category/:categoryId', 'CategoriesController.delete').middleware('auth');

  // Currencies 
  Route.get('/currencies', 'CurrenciesController.index');
  Route.post('/currency', 'CurrenciesController.save');
  Route.put('/currency', 'CurrenciesController.update');
  Route.delete('/currency/:currencyId', 'CurrenciesController.delete');

  // Product Variations 
  Route.get('/productVariations', 'ProductVariationsController.index').middleware('auth');
  Route.post('/productVariation', 'ProductVariationsController.save').middleware('auth');
  Route.put('/productVariation', 'ProductVariationsController.update').middleware('auth');
  Route.delete('/productVariation/:productVariationId', 'ProductVariationsController.delete').middleware('auth');

  // Product Options 
  Route.get('/productOptions', 'ProductOptionsController.index').middleware('auth');
  Route.post('/productOption', 'ProductOptionsController.save').middleware('auth');
  Route.put('/productOption', 'ProductOptionsController.update').middleware('auth');
  Route.delete('/productOption/:productOptionId', 'ProductOptionsController.delete').middleware('auth');

  // Product Options 
  Route.get('/productModifiers', 'ProductModifiersController.index').middleware('auth');
  Route.post('/productModifier', 'ProductModifiersController.save').middleware('auth');
  Route.put('/productModifier', 'ProductModifiersController.update').middleware('auth');
  Route.delete('/productModifier/:productModifierId', 'ProductModifiersController.delete').middleware('auth');

  // Product 
  Route.get('/products', 'ProductsController.index').middleware('auth');
  Route.post('/product', 'ProductsController.save').middleware('auth');
  Route.put('/product', 'ProductsController.update').middleware('auth');
  Route.delete('/product/:productId', 'ProductsController.delete').middleware('auth');
  Route.post('/product/:productId/category/:categoryId', 'ProductsController.attachProductToCategory').middleware('auth');

  // Inventory 
  Route.get('/inventories', 'InventoriesController.index').middleware('auth');
  Route.delete('/inventory/:inventoryId', 'InventoriesController.delete').middleware('auth');
  Route.put('/inventory/:productId', 'InventoriesController.update').middleware('auth');

  // Promotion 
  Route.get('/promotions', 'PromotionsController.index').middleware('auth');
  Route.post('/promotion', 'PromotionsController.save').middleware('auth');
  Route.put('/promotion', 'PromotionsController.update').middleware('auth');
  Route.delete('/promotion/:promotionId', 'PromotionsController.delete').middleware('auth');

  // Promotion 
  Route.get('/promotionCodes', 'PromotionCodesController.index').middleware('auth');
  Route.post('/promotionCode', 'PromotionCodesController.save').middleware('auth');
  Route.put('/promotionCode', 'PromotionCodesController.update').middleware('auth');
  Route.delete('/promotionCode/:promotionCodeId', 'PromotionCodesController.delete').middleware('auth');

  // Cart 
  Route.post('/cart/:cart_uid/calendar/:calendar_uid', 'CartsController.attachCalendarToCart').middleware('auth');
  Route.post('/cartCalendar/:cartCalendarId/product/:productId', 'CartsController.attachProductToCartCalendar').middleware('auth');
  Route.post('/cart/:cartId/checkout', 'CartsController.checkout').middleware('auth');

  // Media 
  Route.post('/product/:productUid/media', 'ProductsController.uploadPhoto').middleware('auth');
  Route.delete('/product/:productUid/media/:mediaUid', 'ProductsController.deletePhoto').middleware('auth');
  Route.post('/calendar/:calendarUid/media', 'CalendarsController.uploadPhoto').middleware('auth');
  Route.delete('/calendar/:calendarUid/media/:mediaUid', 'CalendarsController.deletePhoto').middleware('auth');

  // Helthz
  Route.get('/healthz', async ({ response }) => {
    const isLive = await HealthCheck.isLive()
  
    return isLive
      ? response.status(200).send({})
      : response.status(400).send({})
  })

}).prefix('/api')

