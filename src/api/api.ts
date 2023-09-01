import type { CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';

import { projectKey } from './apiConfig';
import { apiRoot, getAuthApiRoot } from './apiHelpers';

const apiRootWithProjectKey = apiRoot.withProjectKey({ projectKey });

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
  const response = await apiRootWithProjectKey.customers().post({ body: customer }).execute();

  return response;
};

export const getProducts = async (year: string, price: string) => {
  let queryArgs = {};

  if (year && price) {
    queryArgs = {
      where: `masterData(current(masterVariant(attributes(name="year" and value="${year}")))) and masterData(current(masterVariant(attributes(name="price-range" and value="${price}"))))`,
    };
  } else if (year) {
    queryArgs = {
      where: `masterData(current(masterVariant(attributes(name="year" and value="${year}"))))`,
    };
  } else if (price) {
    queryArgs = {
      where: `masterData(current(masterVariant(attributes(name="price-range" and value="${price}"))))`,
    };
  }

  const response = await apiRootWithProjectKey.products().get({ queryArgs }).execute();

  return response;
};

export const getDiscounts = async () => {
  const response = await apiRootWithProjectKey.productDiscounts().get().execute();

  return response;
};
