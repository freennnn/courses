import { useNavigate } from 'react-router-dom';

import classNames from 'classnames';
import type { ProductItem } from 'types';

import '@/components/ProductCard/ProductCard.scss';

interface ProductProps {
  product: ProductItem;
}

const ProductCard = ({ product }: ProductProps) => {
  const navigate = useNavigate();

  let imgUrl = '';

  if (product.images && product.images?.length > 0) {
    imgUrl = product.images[0].url.toString();
  }

  let fullPrice = 0;
  let discountedPrice = 0;

  if (product.price) {
    fullPrice = product.price / 100;
  }

  if (product.discount) {
    discountedPrice = fullPrice - Number(product.discount) / 100;
  }

  const productFullPriceClasses = classNames('product-card__price_full', {
    'product-card__price_has-discount': product.discount,
  });

  return (
    <div
      className='product-card'
      onClick={() => navigate(`/products/${product.id}`, { state: product })}
    >
      {imgUrl ? (
        <div className='product-card__image'>
          <img src={imgUrl} />
        </div>
      ) : null}
      <h3 className='product-card__title'>{product.name['en-US']}</h3>
      {product.description ? (
        <p className='product-card__description'>{product.description['en-US']}</p>
      ) : null}
      <div className='product-card__price'>
        <span className={productFullPriceClasses}>${fullPrice}</span>
        {product.discount ? (
          <span className='product-card__price_discounted'>${discountedPrice}</span>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
