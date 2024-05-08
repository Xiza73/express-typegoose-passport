import { Router } from 'express';

import { exampleRouter } from '@/api/example/exampleRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { ModulePath, Route } from '@/common/models';

const routeList: Route[] = [
  {
    path: ModulePath.HEALTH_CHECK,
    router: healthCheckRouter,
  },
  {
    path: ModulePath.EXAMPLES,
    router: exampleRouter,
  },
];

export const routes = (() => {
  const routes: Router = Router();

  routeList.forEach((route) => {
    routes.use(route.path, route.router);
  });

  return routes;
})();
