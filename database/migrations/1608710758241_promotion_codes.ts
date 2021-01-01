import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PromotionCodes extends BaseSchema {
    protected tableName = 'promotion_codes'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('uid').primary()
            table.string('type').notNullable().defaultTo('promotion_code')
            table.integer('uses').notNullable()
            table.string('code').notNullable()
            table.string('user_uid')
            table.string('promotion_uid').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
