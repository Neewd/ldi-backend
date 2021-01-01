import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CalendarMedias extends BaseSchema {
    protected tableName = 'calendar_medias'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.string('calendar_uid')
            table.string('media_uid')
            table.primary(['calendar_uid', 'media_uid']);
            table.boolean('main_media').notNullable()
            table.timestamps()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
