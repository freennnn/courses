import { useEffect, useState } from 'react';

import Preloader from '@/components/Preloader/Preloader';
import ProductList from '@/features/ProductList/ProductList';
import type { ProductItem } from 'types';

import {
  ASCENDING_SORT_ORDER,
  DESCENDING_SORT_ORDER,
  FROM_TEN_TO_TWENTY_PRICE_RANGE,
  FROM_TWENTY_AND_MORE,
  FROM_ZERO_TO_TEN_PRICE_RANGE,
  SORTING_PARAM_NAME,
  SORTING_PARAM_PRICE,
} from '../../constants';
import { getProductsList } from './helpers';

import '@/pages/CatalogProductPage/CatalogProductPage.scss';

const CatalogProductPage = () => {
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [selectedPriceRangeValue, setSelectedPriceRangeValue] = useState('');
  const [sortingByNameValue, setSortingByNameValue] = useState('');
  const [sortingByPriceValue, setSortingByPriceValue] = useState('');
  const [sortingOrder, setSortingOrder] = useState('');
  const [sortingParam, setSortingParam] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductsList(selectedYear, selectedPriceRange, sortingParam, sortingOrder)
      .then((productList) => {
        setProductList(productList ?? []);
        setLoading(false);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  }, [selectedPriceRange, selectedYear, sortingOrder, sortingParam]);

  const availableYears = ['2020', '2021', '2022', '2023'];
  const availablePriceRanges = ['<10', '10-20', '>20'];
  const avaliableSortingOrderName = ['A-Z', 'Z-A'];
  const avaliableSortingOrderPrice = ['low to high', 'high to low'];

  const handleFilterChange = (year: string, price: string) => {
    setSelectedYear(year);

    let priceRange: string[] = [];

    if (price === availablePriceRanges[0]) {
      priceRange = FROM_ZERO_TO_TEN_PRICE_RANGE;
    } else if (price === availablePriceRanges[1]) {
      priceRange = FROM_TEN_TO_TWENTY_PRICE_RANGE;
    } else if (price === availablePriceRanges[2]) {
      priceRange = FROM_TWENTY_AND_MORE;
    }

    setSelectedPriceRange(priceRange);
    setSelectedPriceRangeValue(price);

    getProductsList(year, priceRange, sortingParam, sortingOrder)
      .then((productList) => {
        setProductList(productList ?? []);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  };

  const handleSortingByName = (sortVal: string) => {
    setSortingParam(SORTING_PARAM_NAME);

    let order = '';
    setSortingByPriceValue('');
    setSortingByNameValue(sortVal);

    if (sortVal === avaliableSortingOrderName[0]) {
      order = ASCENDING_SORT_ORDER;
    } else if (sortVal === avaliableSortingOrderName[1]) {
      order = DESCENDING_SORT_ORDER;
    }

    setSortingOrder(order);

    getProductsList(selectedYear, selectedPriceRange, SORTING_PARAM_NAME, order)
      .then((productList) => {
        setProductList(productList ?? []);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  };

  const handleSortingByPrice = (sortVal: string) => {
    setSortingParam(SORTING_PARAM_PRICE);

    let order = '';
    setSortingByNameValue('');
    setSortingByPriceValue(sortVal);

    if (sortVal === avaliableSortingOrderPrice[0]) {
      order = ASCENDING_SORT_ORDER;
    } else if (sortVal === avaliableSortingOrderPrice[1]) {
      order = DESCENDING_SORT_ORDER;
    }

    setSortingOrder(order);

    getProductsList(selectedYear, selectedPriceRange, SORTING_PARAM_PRICE, order)
      .then((productList) => {
        setProductList(productList ?? []);
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
                onChange={(e) => handleFilterChange(e.target.value, selectedPriceRangeValue)}
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
                value={selectedPriceRangeValue}
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
          <div className='filters__container'>
            <h5 className='filters__subtitle'>Sorting:</h5>
            <div className='filters__sorting'>
              <select
                className='filters__input'
                value={sortingByNameValue}
                onChange={(e) => handleSortingByName(e.target.value)}
              >
                <option disabled value=''>
                  Name
                </option>
                {avaliableSortingOrderName.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                className='filters__input'
                value={sortingByPriceValue}
                onChange={(e) => handleSortingByPrice(e.target.value)}
              >
                <option disabled value=''>
                  Price
                </option>
                {avaliableSortingOrderPrice.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <Preloader />
        ) : productList && productList.length > 0 ? (
          <ProductList productList={productList} />
        ) : (
          <p className='no-products-message'> No movies match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default CatalogProductPage;
