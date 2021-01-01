import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
    protected tableName = 'users'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('user')
            table.string('name')
            table.string('email').notNullable()
            table.string('password').notNullable()
            table.enu('role', ['customer', 'admin']).notNullable().defaultTo('customer')
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
