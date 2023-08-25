import { ProductItem } from 'types';

import '@/components/ProductCard/ProductCard.scss';

interface ProductProps {
  product: ProductItem;
}

const ProductCard = ({ product }: ProductProps) => {
  let imgUrl = '';

  if (product.images && product.images?.length > 0) {
    imgUrl = product.images[0].url.toString();
  }

  return (
    <div className='product-card'>
      <div className='product-card__image'>{imgUrl ? <img src={imgUrl} /> : null}</div>
      <h3 className='product-card__title'>{product.name['en-US']}</h3>
      {product.description ? (
        <p className='product-card__description'>{product.description['en-US']}</p>
      ) : null}
    </div>
  );
};

export default ProductCard;
