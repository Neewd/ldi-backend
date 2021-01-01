import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Carts extends BaseSchema {
    protected tableName = 'carts'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('cart')
            table.bigInteger('price_with_tax_amount').notNullable()
            table.string('price_with_tax_currency').notNullable()
            table.string('price_with_tax_formatted').notNullable()
            table.bigInteger('price_without_tax_amount')
            table.string('price_without_tax_currency')
            table.string('price_without_tax_formatted')
            table.integer('price_tax')
            table.string('user_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
