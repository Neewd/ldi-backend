import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Currencies extends BaseSchema {
    protected tableName = 'currencies'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('currency')
            table.string('code').notNullable()
            table.string('format').notNullable()
            table.string('decimal_point').notNullable()
            table.string('thousand_separator').notNullable()
            table.integer('decimal_places').notNullable()
            table.boolean('default').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
