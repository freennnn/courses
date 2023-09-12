import { ClientResponse, ProductDiscount, ProductProjection } from '@commercetools/platform-sdk';
import { getDiscounts, getProducts } from 'api/api';
import type { DiscountsType } from 'types';

export const getProductsList = async (
  year: string,
  price: string[],
  sortParam: string,
  sortVal: string,
  word: string,
  category: string,
) => {
  let response: ClientResponse<{ results: ProductProjection[] }> | null = null;
  let discounts: ProductDiscount[] = [];

  try {
    response = await getProducts(year, price, sortParam, sortVal, word, category);
    const discountsResponse = await getDiscounts();
    discounts = discountsResponse.body.results;

    if (response) {
      const productList = response.body.results.map((product: ProductProjection) => {
        let price: number | undefined = undefined;

        if (product.masterVariant.prices) {
          if (product.masterVariant.prices[0]) {
            price = product.masterVariant.prices[0].value.centAmount;
          }
        }

        return {
          id: product.id,
          name: product.name,
          categories: product.categories,
          description: product.description,
          images: product.masterVariant.images,
          attributes: product.masterVariant.attributes,
          price,
          discount: getFinalDiscountValue(product, discounts),
        };
      });

      return productList;
    }
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.log(error);
  }
};

const getSingleDiscountValue = (product: ProductProjection, discount: ProductDiscount) => {
  if (
    discount.references[0]?.typeId === 'category' &&
    discount.references[0]?.id === product.categories?.[0]?.id
  ) {
    return {
      sortOrder: discount.sortOrder,
      discount: discount.value.type == 'absolute' ? discount.value.money[0]?.centAmount : 0,
    };
  }
  return { sortOrder: '0', discount: 0 };
};

const getFinalDiscountValue = (product: ProductProjection, discounts: ProductDiscount[]) => {
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
