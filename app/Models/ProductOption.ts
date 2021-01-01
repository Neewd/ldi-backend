import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import ProductVariation from './ProductVariation';

export default class ProductOption extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public product_variation_uid: string

  @belongsTo(() => ProductVariation, {
    foreignKey: 'product_variation_uid',
  })
  public variations: BelongsTo<typeof ProductVariation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (productOption: ProductOption) {
    productOption.uid = uuidv4();
  }
}
