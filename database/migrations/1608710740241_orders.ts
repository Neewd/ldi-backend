import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Orders extends BaseSchema {
    protected tableName = 'orders'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('order')
            table.enu('status', ['complete', 'incomplete']).notNullable()
            table.enu('payment', ['paid', 'unpaid']).notNullable()
            table.enu('shipping', ['fulfilled', 'unfulfilled']).notNullable()
            table.bigInteger('display_price_with_tax_amount').notNullable()
            table.string('display_price_with_tax_currency').notNullable()
            table.string('display_price_with_tax_formatted').notNullable()
            table.bigInteger('display_price_without_tax_amount').notNullable()
            table.string('display_price_without_tax_currency').notNullable()
            table.string('display_price_without_tax_formatted').notNullable()
            table.string('user_uid').notNullable()
            table.string('billing_address_uid').notNullable()
            table.string('shipping_address_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
