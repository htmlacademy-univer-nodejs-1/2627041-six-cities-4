import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { UserType } from '../../types/user-type.enum.js';
import { User } from '../../types/user.type.js';
import { Types } from 'mongoose';
import { createSHA256 } from '../../helpers/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity
  extends defaultClasses.TimeStamps
  implements User, defaultClasses.Base {
  _id: Types.ObjectId;
  id: string;

  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: true, default: '' })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar?: string | undefined;

  @prop({ required: true, default: '' })
  public password: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserType,
  })
  public type!: UserType;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
