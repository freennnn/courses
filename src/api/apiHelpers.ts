import {
  ApiRoot,
  CustomerSignin,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type {
  AnonymousAuthMiddlewareOptions,
  AuthMiddlewareOptions,
  Client,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

// import {createAuthMiddlewareForAnonymousSessionFlow, createClient, httpMiddleware} from '@commercetools/sdk-middleware-auth'
import {
  AUTH_MIDDLEWARE_HOST,
  HTTP_MIDDLEWARE_HOST,
  apiRootScopes,
  authApiRootscopes,
  clientId,
  clientSecret,
  projectKey,
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
  scopes: apiRootScopes,
  fetch,
};

const client: Client = new ClientBuilder()
  .withHttpMiddleware(httpMiddlewareOptions)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .build();

export const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);

export const getAuthApiRoot = (loginRequest: CustomerSignin) => {
  const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
    host: AUTH_MIDDLEWARE_HOST,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
      user: {
        username: loginRequest.email,
        password: loginRequest.password,
      },
    },
    scopes: authApiRootscopes,
    fetch,
  };

  const authClient: Client = new ClientBuilder()
    .withPasswordFlow(passwordAuthMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  const apiRoot: ApiRoot = createApiBuilderFromCtpClient(authClient);
  return apiRoot;
};

export const getAnonymousApiRoot = () => {
  const anonymousMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
    host: AUTH_MIDDLEWARE_HOST,
    projectKey: projectKey,
    credentials: {
      clientId,
      clientSecret,
    },
    scopes: apiRootScopes,
    fetch,
  };

  const anonymousClient: Client = new ClientBuilder()
    .withHttpMiddleware(httpMiddlewareOptions)
    .withAnonymousSessionFlow(anonymousMiddlewareOptions)
    .build();

  const ApiRoot: ApiRoot = createApiBuilderFromCtpClient(anonymousClient);

  return ApiRoot;
};
