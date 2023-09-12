import type {
  CustomerDraft,
  CustomerSignin,
  Product,
  ProductDiscount,
} from '@commercetools/platform-sdk';
import type { DiscountsType, QueryArgs } from 'types';

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

export const getProduct = async (id: string) => {
  const getSingleDiscountValue = (product: Product, discount: ProductDiscount) => {
    if (
      discount.references[0]?.typeId === 'category' &&
      discount.references[0]?.id === product.masterData.current.categories?.[0]?.id
    ) {
      return {
        sortOrder: discount.sortOrder,
        discount: discount.value.type == 'absolute' ? discount.value.money[0]?.centAmount : 0,
      };
    }
    return { sortOrder: '0', discount: 0 };
  };
  const getFinalDiscountValue = (product: Product, discounts: ProductDiscount[]) => {
    const { discount } = discounts.reduce(
      (acc: DiscountsType, val: ProductDiscount): DiscountsType => {
        const { sortOrder, discount } = getSingleDiscountValue(product, val);
        if (Number(sortOrder) > Number(acc.sortOrder)) {
          return { sortOrder, discount };
        }
        return acc;
      },
      { sortOrder: '0', discount: 0 },
    );

    return discount;
  };

  const response = await apiRootWithProjectKey.products().withId({ ID: id }).get().execute();
  const discountsResponse = await getDiscounts();
  let discounts: ProductDiscount[] = [];
  discounts = discountsResponse.body.results;

  const product: Product = response.body;

  let price: number | undefined = undefined;
  if (product.masterData.current.masterVariant.prices) {
    if (product.masterData.current.masterVariant.prices[0]) {
      price = product.masterData.current.masterVariant.prices[0].value.centAmount;
    }
  }

  return {
    id: product.id,
    name: product.masterData.current.name,
    categories: product.masterData.current.categories,
    description: product.masterData.current.description,
    images: product.masterData.current.masterVariant.images,
    attributes: product.masterData.current.masterVariant.attributes,
    price,
    discount: getFinalDiscountValue(product, discounts),
  };
};

export const getProducts = async (
  year: string,
  price: string[],
  sortParam: string,
  sortVal: string,
  word: string,
  category: string,
) => {
  let sortArgs: string[] = [];
  let queryArgs: QueryArgs = {};

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
      ['text.en-US']: word,
    };
  } else if (year) {
    queryArgs = {
      filter: [`variants.attributes.year: ${year}`],
      sort: sortArgs,
      ['text.en-US']: word,
    };
  } else if (price.length > 0) {
    queryArgs = {
      filter: [`variants.price.centAmount:range (${price[0]} to ${price[1]})`],
      sort: sortArgs,
      ['text.en-US']: word,
    };
  } else {
    queryArgs = {
      filter: [],
      sort: sortArgs,
      ['text.en-US']: word,
    };
  }

  if (category && Array.isArray(queryArgs.filter)) {
    queryArgs.filter.push(`categories.id: "${category}"`);
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
