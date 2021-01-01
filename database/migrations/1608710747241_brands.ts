import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Brands extends BaseSchema {
    protected tableName = 'brands'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('brand')
            table.string('name').notNullable()
            table.text('description', 'longtext')
            table.string('slug').unique().notNullable()
            table.enu('status', ['active', 'inactive']).notNullable()
            table.integer('logo_uid')
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
