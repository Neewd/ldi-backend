import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StockTransactions extends BaseSchema {
    protected tableName = 'stock_transactions'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('stock_transaction')
            table.enu('action', ['increment', 'decrement', 'allocate', 'deallocate']).notNullable()
            table.bigInteger('quantity').notNullable()
            table.string('product_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
