import { CustomerSignin, CustomerDraft } from '@commercetools/platform-sdk';

import { apiRoot, getAuthApiRoot } from './apiHelpers';
import { projectKey } from './apiConfig';

export const signIn = async (loginRequest: CustomerSignin) => {
  const authApiRoot = getAuthApiRoot(loginRequest);

  const response = await authApiRoot
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

export const getProducts = async () => {
  const response = await apiRoot.withProjectKey({ projectKey }).products().get().execute();
  return response;
};
