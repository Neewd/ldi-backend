import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasOne, HasOne, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import Calendar from './Calendar'
import Category from './Category'
import { v4 as uuidv4 } from 'uuid';

export default class CalendarRule extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public number_of_product: number

  @column()
  public calendar_uid: string

  @belongsTo(() => Calendar)
  public calendar: BelongsTo<typeof Calendar>

  @column()
  public category_uid: string

  @hasOne(() => Category, {
    localKey: 'category_uid',
  })
  public category: HasOne<typeof Category>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (calendarRule: CalendarRule) {
      calendarRule.uid = uuidv4()
  }
}
