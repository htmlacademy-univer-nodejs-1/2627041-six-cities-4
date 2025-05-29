import { Request, Response, NextFunction } from "express";
import { Middleware } from "../index.js";
import { Logger } from "../../logger/index.js";


export class LoggingMiddleware implements Middleware {
  constructor(
    protected readonly logger: Logger
    ) {}
  execute(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const requestUrl = req.url;
    this.logger.info(`[LoggingMiddleware] Begin request: ${req.method} ${requestUrl}`)
    res.on('finish', () => {
        const duration = Date.now() - start;
        this.logger.info(`[LoggingMiddleware] End request: ${res.statusCode} ${req.method} ${requestUrl}, elapsed ${duration}ms`);
    });
    next()
  }
}
