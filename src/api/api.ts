import type { CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';

import { projectKey } from './apiConfig';
import { apiRoot, getAuthApiRoot } from './apiHelpers';

export const apiRootWithProjectKey = apiRoot.withProjectKey({ projectKey });

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

export const getProducts = async (
  year: string,
  price: string[],
  sortParam: string,
  sortVal: string,
) => {
  let queryArgs = {};
  let sortArgs: string[] = [];

  if (sortParam === 'name') {
    sortArgs = [`name.en-US ${sortVal}`];
  } else if (sortParam === 'price') {
    sortArgs = [`price ${sortVal}`];
  }

  if (year && price.length > 0) {
    queryArgs = {
      filter: [
        `variants.price.centAmount:range (${price[0]} to ${price[1]})`,
        `variants.attributes.year: ${year}`,
      ],
      sort: sortArgs,
    };
  } else if (year) {
    queryArgs = {
      filter: [`variants.attributes.year: ${year}`],
      sort: sortArgs,
    };
  } else if (price.length > 0) {
    queryArgs = {
      filter: [`variants.price.centAmount:range (${price[0]} to ${price[1]})`],
      sort: sortArgs,
    };
  } else {
    queryArgs = {
      sort: sortArgs,
    };
  }

  const response = await apiRootWithProjectKey
    .productProjections()
    .search()
    .get({ queryArgs })
    .execute();

  return response;
};

export const getDiscounts = async () => {
  const response = await apiRootWithProjectKey.productDiscounts().get().execute();

  return response;
};
