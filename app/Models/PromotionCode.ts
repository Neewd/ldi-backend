import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import Promotion from './Promotion';
import User from './User';

export default class PromotionCode extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public uses: number

  @column()
  public code: string

  @column()
  public user_uid: string

  @belongsTo(() => User, {
    foreignKey: 'user_uid',
  })
  public user: BelongsTo<typeof User>

  @column()
  public promotion_uid: string

  @belongsTo(() => Promotion, {
    foreignKey: 'promotion_uid',
  })
  public promotion: BelongsTo<typeof Promotion>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (promotionCode: PromotionCode) {
    promotionCode.uid = uuidv4();
  }
}
