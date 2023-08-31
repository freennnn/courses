import { ClientResponse, Product, ProductDiscount } from '@commercetools/platform-sdk';
import { getDiscounts, getProducts } from 'api/api';
import type { DiscountsType } from 'types';

export const getProductsList = async (year: string, price: string) => {
  let response: ClientResponse<{ results: Product[] }> | null = null;
  let discounts: ProductDiscount[] = [];

  try {
    response = await getProducts(year, price);
    const discountsResponse = await getDiscounts();
    discounts = discountsResponse.body.results;
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.log(error);
  }

  if (response) {
    const productList = response.body.results.map((product: Product) => {
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
    });

    return productList;
  }
};

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
