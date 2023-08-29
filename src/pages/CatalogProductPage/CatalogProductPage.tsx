import { useEffect, useState } from 'react';
import { Product, ProductDiscount, ClientResponse } from '@commercetools/platform-sdk';

import { getDiscounts, getProducts } from 'api/api';
import ProductList from '@/features/ProductList/ProductList';
import { ProductItem, DiscountsType } from 'types';

import '@/pages/CatalogProductPage/CatalogProductPage.scss';

const CatalogProductPage = () => {
  const [productList, setProductList] = useState<ProductItem[] | null | undefined>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  useEffect(() => {
    createProductList(selectedYear, selectedPriceRange)
      .then((productList) => {
        setProductList(productList);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableYears = ['2020', '2021', '2022', '2023'];
  const availablePriceRanges = ['<10', '10-20', '>20'];

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

  const createProductList = async (year: string | null, price: string | null) => {
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

  const handleFilterChange = (year: string, price: string) => {
    setSelectedYear(year);
    setSelectedPriceRange(price);

    createProductList(year, price)
      .then((productList) => {
        setProductList(productList);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  };

  return (
    <div className='catalog-page'>
      <div className='container catalog-page__content'>
        <div className='filters'>
          <div className='filters__container'>
            <div className='filters__item'>
              <h5 className='filters__subtitle'>Year:</h5>
              <select
                className='filters__input'
                value={selectedYear}
                onChange={(e) => handleFilterChange(e.target.value, selectedPriceRange)}
              >
                <option value=''>All</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className='filters__item'>
              <h5 className='filters__subtitle'>Price: $</h5>
              <select
                className='filters__input'
                value={selectedPriceRange}
                onChange={(e) => handleFilterChange(selectedYear, e.target.value)}
              >
                <option value=''>All</option>
                {availablePriceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {productList ? <ProductList productList={productList} /> : null}
      </div>
    </div>
  );
};

export default CatalogProductPage;
