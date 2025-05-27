import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpMethod,
  UploadFileMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './index.js';
import { Config, RestSchema } from '../../libs/config/index.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
    });
    this.addRoute({
      path: '/check',
      method: HttpMethod.Get,
      handler: this.check,
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
      ],
    });
  }

  public async register(
    _req: CreateUserRequest,
    _res: Response
  ): Promise<void> {
    throw new Error('[UserController] Oops');
  }

  public async login(_req: CreateUserRequest, _res: Response): Promise<void> {
    throw new Error('[UserController] Oops');
  }

  public async logout(_req: CreateUserRequest, _res: Response): Promise<void> {
    throw new Error('[UserController] Oops');
  }

  public async check(_req: CreateUserRequest, _res: Response): Promise<void> {
    throw new Error('[UserController] Oops');
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
