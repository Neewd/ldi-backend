import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, manyToMany, ManyToMany, HasOne, hasOne, hasMany, HasMany, computed } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import { ProductStatusEnum } from './Enum/ProductStatusEnum';
import Brand from './Brand';
import Category from './Category';
import Inventory from './Inventory';
import Event from '@ioc:Adonis/Core/Event'
import StockTransaction from './StockTransaction';
import Media from './Media';

export default class Product extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public sku: string

  @column()
  public description: string

  @column()
  public status: ProductStatusEnum

  @column()
  public brand_uid: string

  @belongsTo(() => Brand, {
    foreignKey: 'brand_uid',
  })
  public brand: BelongsTo<typeof Brand>

  @column()
  public category_uid: string

  @belongsTo(() => Category, {
    foreignKey: 'category_uid',
  })
  public category: BelongsTo<typeof Category>

  @manyToMany(() => Category, {
    pivotTable: 'products_categories',
  })
  public categories: ManyToMany<typeof Category>

  @column()
  public parent_uid: string

  @belongsTo(() => Product, {
    foreignKey: 'parent_uid',
  })
  public parent_product: BelongsTo<typeof Product>

  @hasOne(() => Inventory, {
    foreignKey: 'product_uid',
  })
  public inventory: HasOne<typeof Inventory>

  @hasMany(() => StockTransaction, {
    foreignKey: 'product_uid',
  })
  public stockTransactions: HasMany<typeof StockTransaction>

  @manyToMany(() => Media, {
    pivotTable: 'product_medias'
  })
  public medias: ManyToMany<typeof Media>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (product: Product) {
    product.uid = uuidv4();
    Event.emit('new:product', product)
  }

  @computed()
  public get quantity () {
    return this.$extras.pivot_quantity
  }
}
