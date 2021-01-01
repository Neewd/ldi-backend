import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';
import Media from 'App/Models/Media';

export default class Calendar extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public sku: string

  @column()
  public slug: string

  @column()
  public price_with_tax_amount: number

  @column()
  public price_with_tax_currency: string

  @column()
  public price_with_tax_formatted: string

  @column()
  public price_without_tax_amount: number

  @column()
  public price_without_tax_currency: string

  @column()
  public price_without_tax_formatted: string

  @column()
  public price_tax: number

  @manyToMany(() => Media, {
    pivotTable: 'calendar_medias'
  })
  public medias: ManyToMany<typeof Media>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUid (calendar: Calendar) {
      calendar.uid = uuidv4();
  }
}
