import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import Product from './Product';

export default class Inventory extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public total: number

  @column()
  public available: number

  @column()
  public allocated: number

  @column()
  public product_uid: string

  @belongsTo(() => Product, {
    foreignKey: 'product_uid'
  })
  public product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async createUid (inventory: Inventory) {
    inventory.uid = uuidv4();
  }
}
