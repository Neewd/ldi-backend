import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany, manyToMany, ManyToMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import { CategoriesStatusEnum } from './Enum/CategoriesStatusEnum';
import Product from './Product';

export default class Category extends BaseModel {

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
  public description: string

  @column()
  public status: CategoriesStatusEnum
  
  @column()
  public parent_uid: string

  @belongsTo(() => Category, {
    foreignKey: 'parent_uid',
  })
  public parent_category: BelongsTo<typeof Category>

  @hasMany(() => Category, {
    foreignKey: 'parent_uid',
  })
  public child_categories: HasMany<typeof Category>

  @manyToMany(() => Product, {
    pivotTable: 'products_categories',
  })
  public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (category: Category) {
      category.uid = uuidv4();
  }

}
