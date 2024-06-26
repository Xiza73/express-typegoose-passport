import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { authRegistry } from '@/api/auth/routes/auth.router';
import { taskRegistry } from '@/api/task/routes/task.route';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([authRegistry, taskRegistry]);
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
    security: [
      {
        bearerAuth: [],
        apiKeyAuth: [],
      },
    ],
  });
}
