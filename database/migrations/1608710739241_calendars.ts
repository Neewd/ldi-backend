import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Calendars extends BaseSchema {
    protected tableName = 'calendars'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('calendar')
            table.string('name').notNullable()
            table.string('sku').unique().notNullable()
            table.string('slug').unique().notNullable()
            table.bigInteger('price_with_tax_amount').notNullable()
            table.string('price_with_tax_currency').notNullable()
            table.string('price_with_tax_formatted').notNullable()
            table.bigInteger('price_without_tax_amount')
            table.string('price_without_tax_currency')
            table.integer('price_tax')
            table.integer('price_without_tax_formatted')
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
