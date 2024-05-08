import { Router } from 'express';

export const ModulePath = {
  EXAMPLES: '/api/examples',
  HEALTH_CHECK: '/api/health-check',
} as const;
export type ModulePath = (typeof ModulePath)[keyof typeof ModulePath];

export interface Route {
  path: ModulePath;
  router: Router;
}
