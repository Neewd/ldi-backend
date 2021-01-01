import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { BrandStatusEnum } from './Enum/BrandStatusEnum'
import { v4 as uuidv4 } from 'uuid';
import Media from './Media';

export default class Brand extends BaseModel {

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
  public slug: string

  @column()
  public status: BrandStatusEnum

  @column()
  public logo_uid: string

  @belongsTo(() => Media, {
    foreignKey: 'logo_uid'
  })
  public logo: BelongsTo<typeof Media>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (brand: Brand) {
      brand.uid = uuidv4();
  }
  
}
