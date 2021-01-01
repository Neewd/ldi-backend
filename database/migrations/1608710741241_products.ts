import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
    protected tableName = 'products'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('product')
            table.text('name').notNullable()
            table.text('slug').unique().notNullable()
            table.text('sku').unique().notNullable()
            table.text('description', 'longtext').notNullable()
            table.enu('status', ['active', 'inactive']).notNullable()
            table.string('brand_uid')
            table.string('parent_uid').references('uid').inTable('products').onDelete('CASCADE')
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
