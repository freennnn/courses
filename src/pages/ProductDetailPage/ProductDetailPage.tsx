import { useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from '@/components/Button/Button';
import { ButtonBackgroundColor, ButtonType } from '@/components/Button/Button.types';
import { customStyles } from '@/components/Modal/Modal.tsx';
import Slider from '@/components/Slider/Slider';
import { SliderItemDataSourceType } from '@/components/Slider/SliderItem';
import { getProduct } from 'api/api';
import { ProductItem } from 'types';

import { addProductToCart, removeProductFromCart } from '../../businessLogic/cartLogic.ts';
import { AuthContext } from '../../contexts/AuthContext.ts';
import { CartContext, updateCartContext } from '../../contexts/CartContext.ts';
import ProductDetailBreadcrumbs from './ProductDetailBreadcrumbs';
import './ProductDetailPage.scss';

interface ApiError {
  statusCode: number;
  message: string;
}

export default function ProductDetailPage() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedModalSliderItemIndex, setSelectedModalSliderItemIndex] = useState(0);
  const productFromProps = useLocation().state as ProductItem | null;
  const { id } = useParams();
  const [product, setProduct] = useState(productFromProps);
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  function onGetProductError(error: ApiError) {
    if (error.statusCode === 404) {
      navigate('/notFound', { replace: true });
    }
    /* eslint-disable-next-line no-console */
    console.error(error);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const product: ProductItem = await getProduct(id);
        setProduct(product);
      }
    };
    fetchData().catch(onGetProductError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isProductInCart = useMemo(() => {
    return product ? cartContext.items.some((item) => item.productId === product.id) : false;
  }, [product, cartContext]);

  function openModal(index: number) {
    //console.log(`openModalSlider at index${index}`);
    setSelectedModalSliderItemIndex(index);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function cartLineItemIdForProductId(productId: string) {
    return cartContext.items.find((element) => element.productId === productId)?.id;
  }

  function addProductToCartHandler() {
    try {
      product &&
        addProductToCart({
          productId: product.id,
          userId: authContext.id,
          cartId: cartContext.id,
          cartVersion: cartContext.version,
          onAddProductToCart: ({ cartVersion, cartItems, cartItemsQuantity, cartId }) => {
            updateCartContext(cartContext, (prev) => ({
              ...prev,
              id: cartId,
              version: cartVersion,
              quantity: cartItemsQuantity,
              items: cartItems,
            }));
          },
        });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
      toast.error('Ups, something went wrong!');
    }
  }

  function removeProductFromCartHandler() {
    try {
      let lineItemId: string | undefined;
      if (product) {
        lineItemId = cartLineItemIdForProductId(product.id);
      }
      lineItemId &&
        removeProductFromCart({
          lineItemId: lineItemId,
          userId: authContext.id,
          cartId: cartContext.id,
          cartVersion: cartContext.version,
          onRemoveProductFromCart: ({ cartVersion, cartItems, cartItemsQuantity }) => {
            updateCartContext(cartContext, (prev) => ({
              ...prev,
              version: cartVersion,
              quantity: cartItemsQuantity,
              items: cartItems,
            }));
          },
        });
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
      toast.error('Ups, something went wrong!');
    }
  }

  //console.log(product);
  const sliderItems: SliderItemDataSourceType[] | undefined = product?.images?.map((image) => {
    return { imgSrc: image.url, onClickHandler: openModal };
  });

  let slider;
  if (sliderItems) {
    slider = <Slider items={sliderItems} />;
  } else {
    slider = <h3>Ups, product does not have images</h3>;
  }

  let modalSlider;
  if (sliderItems) {
    modalSlider = <Slider items={sliderItems} selectedIndex={selectedModalSliderItemIndex} />;
  } else {
    modalSlider = <h3>Ups, product does not have images</h3>;
  }

  let fullPrice = 0;
  let discountedPrice = 0;

  if (product?.price) {
    fullPrice = product.price / 100;
  }

  if (product?.discount) {
    discountedPrice = fullPrice - Number(product.discount) / 100;
  }

  return (
    <div className='product-detail'>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Product Image Modal'
      >
        {modalSlider}
      </Modal>
      <div className='product-detail__container '>
        <div className='product-detail__content-container'>
          <div className='product-detail__text-content'>
            {product ? (
              <ProductDetailBreadcrumbs
                productName={product.name['en-US']}
                productId={product.id}
              ></ProductDetailBreadcrumbs>
            ) : (
              ''
            )}
            <h3 className='product-detail__title'>{product?.name['en-US']}</h3>
            <p className='product-detail__description'>{product?.description?.['en-US']}</p>
            <div className='product-detail__cart-buttons-container'>
              <Button
                type={ButtonType.contained}
                color={ButtonBackgroundColor.accented}
                disabled={isProductInCart}
                cssClasses={isProductInCart ? ['button_disabled'] : ['']}
                key='Add to cart'
                onClick={addProductToCartHandler}
              >
                {`Add to Cart for $${discountedPrice > 0 ? discountedPrice : fullPrice} `}
                {discountedPrice > 0 ? (
                  <span className='full-price_crossed'>{`$${fullPrice}`}</span>
                ) : (
                  ''
                )}
              </Button>
              <Button
                type={ButtonType.contained}
                color={ButtonBackgroundColor.accented}
                disabled={!isProductInCart}
                cssClasses={!isProductInCart ? ['button_disabled'] : ['']}
                key='Remove from cart'
                onClick={removeProductFromCartHandler}
              >
                Remove from Cart
              </Button>
            </div>
          </div>
          {slider}
        </div>
      </div>
    </div>
  );
}
