import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartCalendars extends BaseSchema {
    protected tableName = 'cart_calendars'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('cart_calendar')
            table.enu('status', ['complete', 'incomplete']).notNullable()
            table.string('cart_uid').notNullable()
            table.string('calendar_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
