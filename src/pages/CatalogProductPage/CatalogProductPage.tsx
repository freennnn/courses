import { useEffect, useState } from 'react';

import ProductList from '@/features/ProductList/ProductList';
import type { ProductItem } from 'types';

import { getProductsList } from './helpers';

import '@/pages/CatalogProductPage/CatalogProductPage.scss';

const CatalogProductPage = () => {
  const [productList, setProductList] = useState<ProductItem[] | undefined>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  useEffect(() => {
    getProductsList(selectedYear, selectedPriceRange)
      .then((productList) => {
        setProductList(productList);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  }, [selectedPriceRange, selectedYear]);

  const availableYears = ['2020', '2021', '2022', '2023'];
  const availablePriceRanges = ['<10', '10-20', '>20'];

  const handleFilterChange = (year: string, price: string) => {
    setSelectedYear(year);
    setSelectedPriceRange(price);

    getProductsList(year, price)
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
        {productList && productList?.length > 0 ? <ProductList productList={productList} /> : null}
      </div>
    </div>
  );
};

export default CatalogProductPage;
