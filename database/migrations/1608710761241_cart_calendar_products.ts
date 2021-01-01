import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartCalendarProducts extends BaseSchema {
    protected tableName = 'cart_calendar_products'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.string('cart_calendar_uid')
            table.string('product_uid')
            table.primary(['cart_calendar_uid', 'product_uid']);
            table.integer('quantity').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
