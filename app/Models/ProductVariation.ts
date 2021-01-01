import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import ProductOption from './ProductOption';

export default class ProductVariation extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public name: string

  @hasMany(() => ProductOption, {
    localKey: 'uid',
    foreignKey: 'product_variation_uid',
  })
  public options: HasMany<typeof ProductOption>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (productVariation: ProductVariation) {
    productVariation.uid = uuidv4();
  }

}
