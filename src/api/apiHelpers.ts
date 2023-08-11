import {
  ClientBuilder,
  Client,
  HttpMiddlewareOptions,
  AuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient, ApiRoot } from '@commercetools/platform-sdk';

import {
  AUTH_MIDDLEWARE_HOST,
  HTTP_MIDDLEWARE_HOST,
  projectKey,
  clientId,
  clientSecret,
} from './apiConfig';

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: HTTP_MIDDLEWARE_HOST,
  fetch,
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: AUTH_MIDDLEWARE_HOST,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes: [`manage_customers:${projectKey}`],
  fetch,
};

const client: Client = new ClientBuilder()
  .withHttpMiddleware(httpMiddlewareOptions)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .build();

export const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
