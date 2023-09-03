import { ChangeEvent, FormEvent, useState } from 'react';

import { AiOutlineSearch } from 'react-icons/ai';

import {
  ASCENDING_SORT_ORDER,
  DESCENDING_SORT_ORDER,
  FROM_TEN_TO_TWENTY_PRICE_RANGE,
  FROM_TWENTY_AND_MORE,
  FROM_ZERO_TO_TEN_PRICE_RANGE,
  SORTING_PARAM_NAME,
  SORTING_PARAM_PRICE,
} from '../../constants';
import type { ProductFilterProps } from '../../types';
import './ProductFilter.scss';

const availableYears = ['2020', '2021', '2022', '2023'];
const availablePriceRanges = ['<10', '10-20', '>20'];
const avaliableSortingOrderName = ['A-Z', 'Z-A'];
const avaliableSortingOrderPrice = ['low to high', 'high to low'];

const ProductFilter = ({ selectedYear, onChangeFilter }: ProductFilterProps) => {
  const [selectedPriceRangeValue, setSelectedPriceRangeValue] = useState('');
  const [sortingByNameValue, setSortingByNameValue] = useState('');
  const [sortingByPriceValue, setSortingByPriceValue] = useState('');
  const [searchInputVal, setSearchInputVal] = useState('');

  const handleFilterChange = (year: string, price: string) => {
    onChangeFilter('year', year);

    let priceRange: string[] = [];

    if (price === availablePriceRanges[0]) {
      priceRange = FROM_ZERO_TO_TEN_PRICE_RANGE;
    } else if (price === availablePriceRanges[1]) {
      priceRange = FROM_TEN_TO_TWENTY_PRICE_RANGE;
    } else if (price === availablePriceRanges[2]) {
      priceRange = FROM_TWENTY_AND_MORE;
    }

    setSelectedPriceRangeValue(price);
    onChangeFilter('priceRange', priceRange);
  };

  const handleSortingByName = (sortVal: string) => {
    onChangeFilter('sortingParam', SORTING_PARAM_NAME);

    let order = '';
    setSortingByPriceValue('');
    setSortingByNameValue(sortVal);

    if (sortVal === avaliableSortingOrderName[0]) {
      order = ASCENDING_SORT_ORDER;
    } else if (sortVal === avaliableSortingOrderName[1]) {
      order = DESCENDING_SORT_ORDER;
    }

    onChangeFilter('sortingOrder', order);
  };

  const handleSortingByPrice = (sortVal: string) => {
    onChangeFilter('sortingParam', SORTING_PARAM_PRICE);

    let order = '';
    setSortingByNameValue('');
    setSortingByPriceValue(sortVal);

    if (sortVal === avaliableSortingOrderPrice[0]) {
      order = ASCENDING_SORT_ORDER;
    } else if (sortVal === avaliableSortingOrderPrice[1]) {
      order = DESCENDING_SORT_ORDER;
    }

    onChangeFilter('sortingOrder', order);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchInputVal(value);
  };

  const performSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChangeFilter('searchWord', searchInputVal);
  };

  return (
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
          className='filters__input filters__input_search'
          type='text'
          placeholder='Search...'
          value={searchInputVal}
          onChange={handleInputChange}
        />
        <button className='filters__input filters__input_button' type='submit'>
          <AiOutlineSearch />
        </button>
      </form>
    </div>
  );
};

export default ProductFilter;
