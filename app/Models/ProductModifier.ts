import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import { ProductModifierEnum } from './Enum/ProductModifierEnum';
import ProductOption from './ProductOption';

export default class ProductModifier extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public name_equals: boolean

  @column()
  public name_append: string

  @column()
  public name_prepend: string

  @column()
  public description_equals: boolean

  @column()
  public description_append: string

  @column()
  public description_prepend: string

  @column()
  public slug_equals: boolean

  @column()
  public slug_append: string

  @column()
  public slug_prepend: string

  @column()
  public sku_equals: boolean

  @column()
  public sku_append: string

  @column()
  public sku_prepend: string

  @column()
  public price_equals: boolean

  @column()
  public price_increment: number

  @column()
  public price_decrement: number

  @column()
  public status: ProductModifierEnum

  @column()
  public product_option_uid: string

  @belongsTo(() => ProductOption, {
    foreignKey: 'product_option_uid',
  })
  public variations: BelongsTo<typeof ProductOption>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (productModifier: ProductModifier) {
    productModifier.uid = uuidv4();
  }
}
