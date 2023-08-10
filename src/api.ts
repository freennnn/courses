import {
  ClientBuilder,
  Client,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

import {
  createApiBuilderFromCtpClient,
  ApiRoot,
  CustomerSignin,
} from '@commercetools/platform-sdk';

const projectKey = 'rs-final';

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.us-central1.gcp.commercetools.com',
  fetch,
};

const passwordAuthMiddlewareOptions: PasswordAuthMiddlewareOptions = {
  host: 'https://auth.us-central1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: 'HdvN8dBxrWuKQrvKMBDClG29',
    clientSecret: 'oBAc24vfn5Bhnr4Xa0u4MAkvyqgWzdcp',
    user: {
      username: 'example@example.com',
      password: 'your-password',
    },
  },
  scopes: ['manage_customers:rs-final'],
  fetch,
};

const client: Client = new ClientBuilder()
  .withHttpMiddleware(httpMiddlewareOptions)
  .withPasswordFlow(passwordAuthMiddlewareOptions)
  .build();

const getApiRoot: () => ApiRoot = () => {
  return createApiBuilderFromCtpClient(client);
};

export const loginUser = async (loginRequest: CustomerSignin) => {
  try {
    const response = await getApiRoot()
      .withProjectKey({ projectKey })
      .login()
      .post({ body: loginRequest })
      .execute();

    // eslint-disable-next-line no-console
    console.log('Logged In Customer:', response.body);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login Error:', error);
  }
};
