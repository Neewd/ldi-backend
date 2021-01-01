import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductOptions extends BaseSchema {
    protected tableName = 'product_options'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.text('uid').primary()
            table.text('type').notNullable().defaultTo('product_option')
            table.text('name').notNullable()
            table.text('description')
            table.text('product_variation_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
