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

const total = 26;
let limit: number;

if (window.innerWidth < 700) {
  limit = 3;
} else if (window.innerWidth < 1000) {
  limit = 6;
} else {
  limit = 9;
}

const CatalogProductPage = () => {
  const [productList, setProductList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [itemsLimit, setItemsLimit] = useState(limit); // Set an initial items limit
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

  // Update the limit based on screen width
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let newLimit = 9; // Default limit

      if (screenWidth < 1000) {
        newLimit = 6; // Adjust the limit for medium-sized screens
      }
      if (screenWidth < 700) {
        newLimit = 3; // Adjust the limit for smaller screens
      }

      setItemsLimit(newLimit);
    };

    // Add a window resize event listener
    window.addEventListener('resize', handleResize);

    // Call the handleResize function initially
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      itemsLimit,
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
    // eslint-disable-next-line
  }, [selectedPriceRange, selectedYear, sortingOrder, sortingParam, searchWord, category]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && offset < total) {
      setLoading(true);
      const offsetNew = offset + itemsLimit;
      setOffset(offsetNew);
      getProductsList(
        selectedYear,
        selectedPriceRange,
        sortingParam,
        sortingOrder,
        searchWord,
        category,
        itemsLimit,
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
  }, [inView, itemsLimit]);

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
      <div className='ref' ref={ref}></div>
    </div>
  );
};

export default CatalogProductPage;
