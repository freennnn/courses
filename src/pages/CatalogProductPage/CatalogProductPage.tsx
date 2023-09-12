import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
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

const limit = 6;
const total = 16;

const CatalogProductPage = () => {
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
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
    setOffset(0);
    getProductsList(
      selectedYear,
      selectedPriceRange,
      sortingParam,
      sortingOrder,
      searchWord,
      category,
      limit,
      0,
    )
      .then((productList) => {
        setProductList(productList ?? []);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedPriceRange, selectedYear, sortingOrder, sortingParam, searchWord, category]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && offset < total) {
      setLoading(true);
      const offsetNew = offset + limit;
      setOffset(offsetNew);
      getProductsList(
        selectedYear,
        selectedPriceRange,
        sortingParam,
        sortingOrder,
        searchWord,
        category,
        limit,
        offsetNew,
      )
        .then((productList) => {
          if (productList && productList.length > 0) {
            setProductList((prevProductList) => [...prevProductList, ...productList]);
          }
          setLoading(false);
        })
        .catch((error) => {
          /* eslint-disable-next-line no-console */
          console.error('Error fetching products:', error);
        });
    }
    // eslint-disable-next-line
  }, [inView]);

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
      <div ref={ref}></div>
    </div>
  );
};

export default CatalogProductPage;
