import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Promotions extends BaseSchema {
    protected tableName = 'promotions'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('promotion')
            table.string('name').notNullable()
            table.text('description', 'longtext')
            table.boolean('active').notNullable()
            table.boolean('automatic').notNullable()
            table.enu('promotion_type', ['fixed_discount', 'percent_discount', 'x_for_y', 'x_for_amount', 'bundle_fixed_discount', 'item_fixed_discount', 'item_percent_discount']).notNullable()
            table.dateTime('start').notNullable()
            table.dateTime('end').notNullable()
            table.json('schema').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
