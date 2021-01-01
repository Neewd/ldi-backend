import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { PromotionTypeEnum } from 'App/Models/Enum/PromotionTypeEnum';
import { v4 as uuidv4 } from 'uuid';

export default class Promotion extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public description: string

  @column()
  public name: string

  @column()
  public active: boolean

  @column()
  public automatic: boolean

  @column()
  public promotion_type: PromotionTypeEnum;

  @column.dateTime({ autoCreate: false })
  public start: DateTime

  @column.dateTime({ autoCreate: false })
  public end: DateTime

  @column({
    serialize: value => {
      return value ? JSON.parse(value) : value;
    }
  })
  public schema: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (promotion: Promotion) {
    promotion.uid = uuidv4();
  }
}
