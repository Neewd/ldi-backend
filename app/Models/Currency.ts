import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';

export default class Currency extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public code: string

  @column()
  public format: string

  @column()
  public decimal_point: string

  @column()
  public thousand_separator: string

  @column()
  public decimal_places: number

  @column()
  public default: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @beforeCreate()
  public static async createUid (currency: Currency) {
    currency.uid = uuidv4();
  }
}
