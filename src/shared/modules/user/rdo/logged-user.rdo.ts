import { Expose } from 'class-transformer';
import { UserType } from '../../../types/index.js';

export class LoggedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;

  @Expose()
  public name: string;

  @Expose()
  public type: UserType;

  @Expose()
  public avatar: string;
}
