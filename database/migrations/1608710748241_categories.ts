import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Categories extends BaseSchema {
    protected tableName = 'categories'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('category')
            table.string('name').notNullable()
            table.string('slug').unique().notNullable()
            table.text('description', 'longtext')
            table.enu('status', ['active', 'inactive']).notNullable()
            table.string('parent_uid').references('uid').inTable('categories').onDelete('CASCADE')
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
