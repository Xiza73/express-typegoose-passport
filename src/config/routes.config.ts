import { Router } from 'express';

import { authRouter } from '@/api/auth/routes/auth.router';
import { taskRouter } from '@/api/task/routes/task.route';
import { ModulePath, Route } from '@/common/models/route.model';

const routeList: Route[] = [
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
