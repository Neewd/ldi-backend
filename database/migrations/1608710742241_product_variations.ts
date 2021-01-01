import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductVariations extends BaseSchema {
    protected tableName = 'product_variations'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('product_variation')
            table.string('name').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
