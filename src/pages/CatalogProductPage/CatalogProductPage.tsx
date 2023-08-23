import { useEffect, useState } from 'react';
import {
  Attribute,
  Image,
  Product,
  LocalizedString,
  CategoryReference,
} from '@commercetools/platform-sdk';

import { getProducts } from 'api/api';

interface ProductItem {
  id: string;
  name: LocalizedString;
  categories: CategoryReference[];
  description: LocalizedString | undefined;
  images: Image[] | undefined;
  attributes: Attribute[] | undefined;
}

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
  /* eslint-disable-next-line no-console */
  console.log(productList);

  return <div>Catalog Product Page</div>;
};

export default CatalogProductPage;
