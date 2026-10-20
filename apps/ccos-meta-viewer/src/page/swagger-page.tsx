import SwaggerUI from 'swagger-ui-react';

import 'swagger-ui-react/swagger-ui.css';
import '../swagger-dark/SwaggerDark.css';
import { swaggerSpec } from './swagger-spec';

export function SwaggerPage() {
  return <SwaggerUI spec={swaggerSpec} />;
}

export default SwaggerPage;
