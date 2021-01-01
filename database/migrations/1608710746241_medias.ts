import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Medias extends BaseSchema {
    protected tableName = 'medias'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('media')
            table.integer('url').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
