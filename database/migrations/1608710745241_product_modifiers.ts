import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductModifiers extends BaseSchema {
    protected tableName = 'product_modifiers'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('product_modifier')
            table.boolean('name_equals')
            table.string('name_append')
            table.string('name_prepend')
            table.boolean('description_equals')
            table.text('description_append', 'longtext')
            table.text('description_prepend', 'longtext')
            table.boolean('slug_equals')
            table.string('slug_append')
            table.string('slug_prepend')
            table.boolean('sku_equals')
            table.string('sku_append')
            table.string('sku_prepend')
            table.enu('status', ['active', 'inactive'])
            table.boolean('price_equals')
            table.bigInteger('price_decrement')
            table.bigInteger('price_increment')
            table.text('product_option_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
