import { CustomerSignin, CustomerDraft, ClientResponse } from '@commercetools/platform-sdk';

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

export const getProducts = async (year: string, price: string) => {
  let response: ClientResponse | null = null;

  if (year && price) {
    response = await apiRoot
      .withProjectKey({ projectKey })
      .products()
      .get({
        queryArgs: {
          where: `masterData(current(masterVariant(attributes(name="year" and value="${year}")))) and masterData(current(masterVariant(attributes(name="price-range" and value="${price}"))))`,
        },
      })
      .execute();
  } else if (year) {
    response = await apiRoot
      .withProjectKey({ projectKey })
      .products()
      .get({
        queryArgs: {
          where: `masterData(current(masterVariant(attributes(name="year" and value="${year}"))))`,
        },
      })
      .execute();
  } else if (price) {
    response = await apiRoot
      .withProjectKey({ projectKey })
      .products()
      .get({
        queryArgs: {
          where: `masterData(current(masterVariant(attributes(name="price-range" and value="${price}"))))`,
        },
      })
      .execute();
  } else {
    response = await apiRoot.withProjectKey({ projectKey }).products().get().execute();
  }

  return response;
};

export const getDiscounts = async () => {
  const response = await apiRoot.withProjectKey({ projectKey }).productDiscounts().get().execute();
  return response;
};

export const queryCustomer = async (customerID: string) => {
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: customerID })
    .get()
    .execute();
  return response;
};
