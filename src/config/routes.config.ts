import { Router } from 'express';

import { authRouter } from '@/api/auth/routes/auth.router';
import { exampleRouter } from '@/api/example/exampleRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { taskRouter } from '@/api/task/routes/task.route';
import { ModulePath, Route } from '@/common/models/route.model';

const routeList: Route[] = [
  {
    path: ModulePath.HEALTH_CHECK,
    router: healthCheckRouter,
  },
  {
    path: ModulePath.EXAMPLES,
    router: exampleRouter,
  },
  {
    path: ModulePath.AUTH,
    router: authRouter,
  },
  {
    path: ModulePath.TASK,
    router: taskRouter,
  },
];

export const routes = (() => {
  const routes: Router = Router();

  routeList.forEach((route) => {
    routes.use(route.path, route.router);
  });

  return routes;
})();
