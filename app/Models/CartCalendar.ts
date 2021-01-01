import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, manyToMany, ManyToMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { CartCalendarStatusEnum } from './Enum/CartCalendarStatusEnum'
import Cart from './Cart'
import { v4 as uuidv4 } from 'uuid';
import Calendar from './Calendar'
import Product from './Product';

export default class CartCalendar extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public status: CartCalendarStatusEnum

  @column()
  public cart_uid: string

  @belongsTo(() => Cart, {
    foreignKey: 'cart_uid',
  })
  public cart: BelongsTo<typeof Cart>

  @column()
  public calendar_uid: string

  @belongsTo(() => Calendar, {
    foreignKey: 'calendar_uid',
  })
  public calendar: BelongsTo<typeof Calendar>

  @manyToMany(() => Product, {
    pivotTable: 'cart_calendar_products',
  })
  public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (cartCalendar: CartCalendar) {
    cartCalendar.uid = uuidv4();
  }
}
