import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, beforeSave, hasMany, HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { UserRoleEnum } from './Enum/UserRoleEnum';
import Address from './Address';
import Event from '@ioc:Adonis/Core/Event'
import Cart from './Cart';
import { v4 as uuidv4 } from 'uuid';

export default class User extends BaseModel {

  public static selfAssignPrimaryKey = true

  @column({isPrimary: true})
  public uid: string

  @column()
  public email: string

  @column()
  public name: string

  @column()
  public type: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public role: UserRoleEnum

  @hasMany(() => Address, {
    localKey: 'uid',
    foreignKey: 'user_uid',
  })
  public addresses: HasMany<typeof Address>

  @hasOne(() => Cart, {
    foreignKey: 'user_uid',
  })
  public cart: HasOne<typeof Cart>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async createUid (user: User) {
    user.uid = uuidv4();
    Event.emit('new:user', user)
  }
}
