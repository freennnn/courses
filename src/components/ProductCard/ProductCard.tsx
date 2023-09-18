import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import classNames from 'classnames';
import { MdAddShoppingCart } from 'react-icons/md';
import type { ProductItem } from 'types';

import { addItemToCart, createAnonymousCart, createUserCart } from '../../api/api.ts';
import { AuthContext } from '../../contexts/AuthContext.ts';
import { CartContext, updateCartContext } from '../../contexts/CartContext.ts';
import './ProductCard.scss';

interface ProductProps {
  product: ProductItem;
}

const ProductCard = ({ product }: ProductProps) => {
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);

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

  const handleAddItem = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      toast.info('Adding to cart...'); // Display adding to cart toast

      if (!cartContext.id) {
        if (authContext.id) {
          const { body: cart } = await createUserCart();
          const { body: updatedCart } = await addItemToCart(
            authContext.id,
            cart.id,
            product.id,
            cart.version,
          );
          updateCartContext(cartContext, (prev) => ({
            ...prev,
            id: updatedCart.id,
            version: updatedCart.version,
            quantity: updatedCart.totalLineItemQuantity,
            items: updatedCart.lineItems,
          }));
        } else {
          const { body: cart } = await createAnonymousCart();
          const { body: updatedCart } = await addItemToCart(
            authContext.id,
            cart.id,
            product.id,
            cart.version,
          );
          updateCartContext(cartContext, (prev) => ({
            ...prev,
            id: updatedCart.id,
            version: updatedCart.version,
            quantity: updatedCart.totalLineItemQuantity,
            items: updatedCart.lineItems,
          }));
        }
      } else {
        const { body: updatedCart } = await addItemToCart(
          authContext.id,
          cartContext.id,
          product.id,
          cartContext.version,
        );
        updateCartContext(cartContext, (prev) => ({
          ...prev,
          version: updatedCart.version,
          quantity: updatedCart.totalLineItemQuantity,
          items: updatedCart.lineItems,
        }));
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
      toast.error('Ups, something went wrong!');
    }
  };

  const itemExistsInCart = cartContext.items.some((item) => item.productId === product.id);

  return (
    <Link to={`/products/${product.id}`} className='product-card' data-testid='product-card'>
      {imgUrl ? (
        <div className='product-card__image'>
          <img src={imgUrl} />
        </div>
      ) : null}
      <h3 className='product-card__title'>{product.name['en-US']}</h3>
      <div className='product-card__description_wrapper'>
        {product.description ? (
          <p className='product-card__description_inner'>{product.description['en-US']}</p>
        ) : null}
        <button
          disabled={itemExistsInCart}
          className='product-card__add-btn'
          onClick={handleAddItem}
        >
          <MdAddShoppingCart />
        </button>
      </div>

      <div className='product-card__price'>
        <span className={productFullPriceClasses}>${fullPrice}</span>
        {product.discount ? (
          <span className='product-card__price_discounted'>${discountedPrice}</span>
        ) : null}
      </div>
    </Link>
  );
};

export default ProductCard;
