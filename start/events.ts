import Event from '@ioc:Adonis/Core/Event'

Event.on('new:product', 'Product.handleNewProduct')
Event.on('new:user', 'User.handleNewUser')