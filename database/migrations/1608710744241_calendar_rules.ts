import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CalendarRules extends BaseSchema {
    protected tableName = 'calendar_rules'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.text('uid').primary()
            table.text('type').notNullable().defaultTo('calendar_rule')
            table.integer('number_of_product').notNullable()
            table.integer('calendar_uid').notNullable()
            table.integer('category_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
