import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductMedias extends BaseSchema {
    protected tableName = 'product_medias'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.string('product_uid')
            table.string('media_uid')
            table.primary(['product_uid', 'media_uid']);
            table.boolean('main_media').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
