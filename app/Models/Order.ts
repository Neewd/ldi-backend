import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { OrderPaymentEnum } from 'App/Models/Enum/OrderPaymentEnum';
import { OrderStatusEnumm } from 'App/Models/Enum/OrderStatusEnum';
import { OrderShippingEnum } from 'App/Models/Enum/OrderShippingEnum';
import User from 'App/Models/User';
import Address from 'App/Models/Address';
import { v4 as uuidv4 } from 'uuid';

export default class Order extends BaseModel {
  
  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public status: OrderStatusEnumm

  @column()
  public payment: OrderPaymentEnum

  @column()
  public shipping: OrderShippingEnum

  @column()
  public display_price_with_tax_amount: number

  @column()
  public display_price_with_tax_currency: string

  @column()
  public display_price_with_tax_formatted: string

  @column()
  public display_price_without_tax_amount: number

  @column()
  public display_price_without_tax_currency: string

  @column()
  public display_price_without_tax_formatted: string

  @column()
  public user_uid: string

  @belongsTo(() => User, {
    foreignKey: 'user_uid',
  })
  public user: BelongsTo<typeof User>

  @column()
  public shipping_address_uid: string

  @belongsTo(() => Address, {
    foreignKey: 'shipping_address_uid',
  })
  public shipping_address: BelongsTo<typeof Address>
  
  @column()
  public billing_address_uid: string
  
  @belongsTo(() => Address, {
    foreignKey: 'billing_address_uid',
  })
  public billing_address: BelongsTo<typeof Address>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (order: Order) {
    order.uid = uuidv4();
  }
}
