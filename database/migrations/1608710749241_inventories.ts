import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Inventories extends BaseSchema {
    protected tableName = 'inventories'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('inventory')
            table.bigInteger('total').notNullable()
            table.bigInteger('available').notNullable()
            table.bigInteger('allocated').notNullable()
            table.string('product_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
