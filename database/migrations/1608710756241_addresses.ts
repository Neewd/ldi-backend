import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
    protected tableName = 'addresses'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('address')
            table.string('name').notNullable()
            table.string('first_name').notNullable()
            table.string('last_name').notNullable()
            table.string('phone_number').notNullable()
            table.text('instructions', 'longtext')
            table.string('company_name')
            table.string('line_1').notNullable()
            table.string('line_2')
            table.string('city').notNullable()
            table.string('country').notNullable()
            table.string('zipcode').notNullable()
            table.integer('user_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
