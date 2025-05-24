import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './index.js';
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/check', method: HttpMethod.Get, handler: this.check });
  }

  public async register(
    _req: CreateUserRequest,
    _res: Response,
  ): Promise<void> {
     throw new Error('[UserController] Oops');
  }

  public async login(
    _req: CreateUserRequest,
    _res: Response,
  ): Promise<void> {
     throw new Error('[UserController] Oops');
  }

  public async logout(
    _req: CreateUserRequest,
    _res: Response,
  ): Promise<void> {
     throw new Error('[UserController] Oops');
  }

  public async check(
    _req: CreateUserRequest,
    _res: Response,
  ): Promise<void> {
     throw new Error('[UserController] Oops');
  }
}