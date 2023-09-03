import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import CategoryList from '@/features/CategoryList/CategoryList';
import ProductList from '@/features/ProductList/ProductList';
import { getProductsList } from '@/pages/CatalogProductPage/helpers';
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

import '@/pages/CatalogProductPage/CatalogProductPage.scss';

const CategoryPage = () => {
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [selectedPriceRangeValue, setSelectedPriceRangeValue] = useState('');
  const [sortingByNameValue, setSortingByNameValue] = useState('');
  const [sortingByPriceValue, setSortingByPriceValue] = useState('');
  const [sortingOrder, setSortingOrder] = useState('');
  const [sortingParam, setSortingParam] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [searchInputVal, setSearchInputVal] = useState('');

  const { url } = useParams();
  const category = url ? url : 'efd4648a-7c17-4fc8-99e4-3338cdcd5bf9';

  useEffect(() => {
    setLoading(true);
    getProductsList(
      selectedYear,
      selectedPriceRange,
      sortingParam,
      sortingOrder,
      searchWord,
      category,
    )
      .then((productList) => {
        setProductList(productList ?? []);
        setLoading(false);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  }, [selectedPriceRange, selectedYear, sortingOrder, sortingParam, searchWord, category]);

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
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event !== null) {
      const { value } = event.target;
      setSearchInputVal(value);
    }
  };

  const performSearch = (event: FormEvent<HTMLFormElement>) => {
    if (event !== null) {
      event.preventDefault();
    }

    setSearchWord(searchInputVal);
  };

  interface ActiveItem {
    id: string;
    name: string;
    path?: string;
    pathid?: string;
  }

  const tempActiveItem: ActiveItem = {
    id: '',
    name: '',
    path: '',
    pathid: '',
  };

  const [activeCat, setActiveCat] = useState<ActiveItem>(tempActiveItem);

  const onActiveCategory = (item: ActiveItem): void => {
    setActiveCat(item);
  };

  return (
    <div className='catalog-page'>
      <div className='container catalog-page__content'>
        <CategoryList handleActiveCategory={onActiveCategory} />
        <Breadcrumbs data={activeCat} />
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
          <form className='filters__container' onSubmit={performSearch}>
            <input
              className='filters__input filters__input-search'
              type='text'
              placeholder='Search...'
              value={searchInputVal}
              onChange={handleInputChange}
            />
            <button className='filters__input filters__input-button' type='submit'></button>
          </form>
        </div>
        {loading ? (
          <p>p</p>
        ) : productList.length > 0 ? (
          <ProductList productList={productList} />
        ) : (
          <p className='no-products-message'> No movies match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
