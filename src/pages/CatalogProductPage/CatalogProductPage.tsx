import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import ProductFilter from '@/components/Filter/ProductFilter';
import useProductFilter from '@/components/Filter/useProductFilter';
import Preloader from '@/components/Preloader/Preloader';
import CategoryList from '@/features/CategoryList/CategoryList';
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

  const { url } = useParams();
  const category = url ? url : '';
  interface ActiveItem {
    id: string;
    name: string;
    path?: string;
    pathid?: string;
  }

  const [activeCat, setActiveCat] = useState<ActiveItem>({
    id: '',
    name: '',
    path: '',
    pathid: '',
  });

  const onActiveCategory = (item: ActiveItem) => {
    setActiveCat(item);
    setActiveId(item.id);
  };

  const [activeId, setActiveId] = useState<string>('');
  const onActiveId = (id: string): void => {
    setActiveId(id);
  };

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

  return (
    <div className='catalog-page'>
      <div className='container catalog-page__content'>
        <CategoryList handleActiveCategory={onActiveCategory} newId={activeId} />
        <Breadcrumbs data={activeCat} onActiveId={onActiveId} />
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
