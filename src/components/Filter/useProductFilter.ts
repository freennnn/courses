import { useState } from 'react';

export default function useProductFilter() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [sortingOrder, setSortingOrder] = useState('');
  const [sortingParam, setSortingParam] = useState('');
  const [searchWord, setSearchWord] = useState('');

  const handleFilterChange = (type: string, value: string | string[]) => {
    switch (type) {
      case 'year':
        if (typeof value === 'string') {
          setSelectedYear(value);
        }

        break;
      case 'priceRange':
        setSelectedPriceRange(value as string[]);
        break;
      case 'sortingOrder':
        if (typeof value === 'string') {
          setSortingOrder(value);
        }

        break;
      case 'sortingParam':
        if (typeof value === 'string') {
          setSortingParam(value);
        }

        break;
      case 'searchWord':
        if (typeof value === 'string') {
          setSearchWord(value);
        }

        break;
    }
  };

  return {
    selectedYear,
    selectedPriceRange,
    sortingOrder,
    sortingParam,
    searchWord,
    handleFilterChange,
  };
}
