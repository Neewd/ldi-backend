import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductsCategories extends BaseSchema {
    protected tableName = 'products_categories'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.string('product_uid')
            table.string('category_uid')
            table.primary(['category_uid', 'product_uid']);
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
