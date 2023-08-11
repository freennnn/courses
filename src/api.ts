import {
  ClientBuilder,
  Client,
  HttpMiddlewareOptions,
  AuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

import {
  createApiBuilderFromCtpClient,
  ApiRoot,
  CustomerSignin,
  CustomerDraft,
} from '@commercetools/platform-sdk';

const projectKey: string =
  typeof import.meta.env.VITE_CTP_PROJECT_KEY === 'string'
    ? import.meta.env.VITE_CTP_PROJECT_KEY
    : '';

const clientId: string =
  typeof import.meta.env.VITE_CTP_CLIENT_ID === 'string' ? import.meta.env.VITE_CTP_CLIENT_ID : '';

const clientSecret: string =
  typeof import.meta.env.VITE_CTP_CLIENT_SECRET === 'string'
    ? import.meta.env.VITE_CTP_CLIENT_SECRET
    : '';

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.us-central1.gcp.commercetools.com',
  fetch,
};

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.us-central1.gcp.commercetools.com',
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

const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);

export const signIn = async (loginRequest: CustomerSignin) => {
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .login()
    .post({ body: loginRequest })
    .execute();

  return response;
};

export const signUp = async (customer: CustomerDraft) => {
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({ body: customer })
    .execute();

  return response;
};
