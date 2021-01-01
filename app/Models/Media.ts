import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, computed } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';

export default class Media extends BaseModel {
  
  public static selfAssignPrimaryKey = true

  public static table = 'medias';

  @column({isPrimary: true, columnName: 'uid'})
  public uid: string

  @column()
  public type: string

  @column()
  public url: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (media: Media) {
    media.uid = await uuidv4();
  }

  @computed()
  public get main_media () {
    return this.$extras.pivot_main_media
  }
}
