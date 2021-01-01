import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { v4 as uuidv4 } from 'uuid';

export default class Address extends BaseModel {
  
  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public last_name: string

  @column()
  public first_name: string

  @column()
  public phone_number: string

  @column()
  public instructions: string

  @column()
  public company_name: string

  @column()
  public line_1: string

  @column()
  public line_2: string

  @column()
  public city: string

  @column()
  public country: string

  @column()
  public zipcode: string

  @column()
  public user_uid: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (address: Address) {
    address.uid = uuidv4();
  }
}
