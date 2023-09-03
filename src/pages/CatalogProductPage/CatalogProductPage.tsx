import { useEffect, useState } from 'react';

import ProductFilter from '@/components/Filter/ProductFilter';
import useProductFilter from '@/components/Filter/useProductFilter';
import Preloader from '@/components/Preloader/Preloader';
import ProductList from '@/features/ProductList/ProductList';
import type { ProductItem } from 'types';

import { getProductsList } from './helpers';

import '@/pages/CatalogProductPage/CatalogProductPage.scss';

const CatalogProductPage = () => {
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    selectedYear,
    selectedPriceRange,
    sortingOrder,
    sortingParam,
    searchWord,
    handleFilterChange,
  } = useProductFilter();

  useEffect(() => {
    setLoading(true);
    getProductsList(selectedYear, selectedPriceRange, sortingParam, sortingOrder, searchWord)
      .then((productList) => {
        setProductList(productList ?? []);
        setLoading(false);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  }, [selectedPriceRange, selectedYear, sortingOrder, sortingParam, searchWord]);

  return (
    <div className='catalog-page'>
      <div className='container catalog-page__content'>
        <ProductFilter selectedYear={selectedYear} onChangeFilter={handleFilterChange} />
        {loading ? (
          <Preloader />
        ) : productList.length > 0 ? (
          <ProductList productList={productList} />
        ) : (
          <p className='no-products-message'> No movies match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default CatalogProductPage;
