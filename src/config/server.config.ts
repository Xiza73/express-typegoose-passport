import '@/config/jwt-strategy.config';

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/error-handler.middleware';
import rateLimiter from '@/common/middleware/rate-limiter.middleware';
import requestLogger from '@/common/middleware/request-logger.middleware';
import { env } from '@/common/utils/env-config.util';

import { routes } from './routes.config';

const _app: Express = express();

// Set the application to trust the reverse proxy
_app.set('trust proxy', true);

// Middlewares
_app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
_app.use(morgan('dev'));
_app.use(bodyParser.urlencoded({ extended: true }));
_app.use(bodyParser.json());
_app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({
      error: 'Invalid JSON payload passed.',
    });
  } else {
    next();
  }
});
_app.use(cookieParser());
_app.use(
  session({
    secret: env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
_app.use(passport.initialize());
_app.use(passport.session());

_app.use(helmet());
_app.use(helmet.xssFilter());
_app.use(helmet.hidePoweredBy());
_app.use(
  helmet.hsts({
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  })
);
_app.use(helmet.frameguard({ action: 'deny' }));
_app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      frameAncestors: ["'none'"],
      connectSrc: ["'self'"],
    },
  })
);
_app.use(rateLimiter);

// Request logging
_app.use(requestLogger);

// Routes
_app.use('/', routes);

// Swagger UI
_app.use(openAPIRouter);

// Error handlers
_app.use(errorHandler());

export const app = _app;
