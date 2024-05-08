import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

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
_app.use(helmet());
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
