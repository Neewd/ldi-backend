import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductProductVariations extends BaseSchema {
    protected tableName = 'product_product_variations'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('product_product_variation')
            table.integer('product_variation_uid').notNullable()
            table.integer('product_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
