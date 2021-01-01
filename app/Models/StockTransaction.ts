import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { StockTransactionEnum } from './Enum/StockTransactionEnum'
import Product from './Product'
import { v4 as uuidv4 } from 'uuid';

export default class StockTransaction extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public action: StockTransactionEnum

  @column()
  public quantity: number

  @column()
  public product_uid: string

  @belongsTo(() => Product, {
    foreignKey: 'product_uid',
  })
  public product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (stockTransaction: StockTransaction) {
    stockTransaction.uid = uuidv4();
  }
}
