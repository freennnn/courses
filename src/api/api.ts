import { CustomerSignin, CustomerDraft } from '@commercetools/platform-sdk';

import { apiRoot } from './apiHelpers';
import { projectKey } from './apiConfig';

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
