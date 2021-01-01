import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import User from 'App//Models/User';
import CartCalendar from './CartCalendar';

export default class Cart extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public price_with_tax_amount: number

  @column()
  public price_with_tax_currency: string

  @column()
  public price_with_tax_formatted: string

  @column()
  public price_without_tax_amount: number

  @column()
  public price_without_tax_currency: string

  @column()
  public price_without_tax_formatted: string

  @column()
  public price_tax: number

  @column()
  public user_uid: string
  
  @belongsTo(() => User, {
    foreignKey: 'user_uid',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => CartCalendar, {
    foreignKey: 'cart_uid',
  })
  public cartCalendars: HasMany<typeof CartCalendar>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (cart: Cart) {
    cart.uid = uuidv4();
  }
}
