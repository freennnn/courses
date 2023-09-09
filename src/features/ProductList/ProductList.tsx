import ProductCard from 'components/ProductCard/ProductCard';
import { ProductItem } from 'types';

import './ProductList.scss';

interface ProductListProps {
  productList: ProductItem[];
}

const ProductList = ({ productList }: ProductListProps) => {
  return (
    <div className='product-list'>
      {productList.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
