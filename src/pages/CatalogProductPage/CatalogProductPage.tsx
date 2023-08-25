import { useEffect, useState } from 'react';
import { Product } from '@commercetools/platform-sdk';

import { getProducts } from 'api/api';
import ProductList from '@/features/ProductList/ProductList';
import { ProductItem } from 'types';

import '@/pages/CatalogProductPage/CatalogProductPage.scss';

const CatalogProductPage = () => {
  const [productList, setProductList] = useState<ProductItem[] | null | undefined>(null);

  useEffect(() => {
    createProductList()
      .then((productList) => {
        setProductList(productList);
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error('Error fetching products:', error);
      });
  }, []);

  const createProductList = async () => {
    const response = await getProducts();

    if (response) {
      const productList = response.body.results.map((product: Product) => {
        return {
          id: product.id,
          name: product.masterData.current.name,
          categories: product.masterData.current.categories,
          description: product.masterData.current.description,
          images: product.masterData.current.masterVariant.images,
          attributes: product.masterData.current.masterVariant.attributes,
        };
      });

      return productList;
    }
  };

  return (
    <div className='catalog-page'>
      <div className='container catalog-page__content'>
        {productList ? <ProductList productList={productList} /> : null}
      </div>
    </div>
  );
};

export default CatalogProductPage;
