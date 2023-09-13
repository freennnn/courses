import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { CentPrecisionMoney, LineItem } from '@commercetools/platform-sdk';

import {
  addDiscount,
  cartDiscounts,
  deleteCart,
  getActiveCart,
  removeItem,
} from '../../api/api.ts';
import { AuthContext } from '../../contexts/AuthContext.ts';
import { CartContext, updateCartContext } from '../../contexts/CartContext.ts';
import './BasketList.scss';
import Quantity from './Quantity';

export default function BasketList() {
  const { id: userId } = useContext(AuthContext);
  const [cartId, setCartId] = useState('1');
  const [version, setVersion] = useState(1);
  const [items, setItems] = useState<LineItem[]>();
  const [answer, setAnswer] = useState<string>('');
  const [total, setTotal] = useState<CentPrecisionMoney>();
  const cartContext = useContext(CartContext);

  async function findCart(userId: string): Promise<void> {
    try {
      await getActiveCart(userId).then(({ body }) => {
        if (body?.id) {
          setCartId(body.id);
        }
        if (body?.lineItems) {
          setItems(body.lineItems);
        }
        if (body?.totalPrice) {
          setTotal(body.totalPrice);
        }
        if (body?.version) {
          setVersion(body.version);
        }
      });
    } catch (err) {
      /* eslint-disable no-console */
      console.log(`The cart is empty.`);
      setAnswer(`The cart is empty. Please, go to`);
    }
  }

  const removeLine = async (lineItemId: string) => {
    const { body: cart } = await removeItem(userId, cartId, lineItemId, version);
    setVersion(cart.version);
    updateCartContext(cartContext, (response) => ({
      ...response,
      version: cart.version,
      quantity: cart.totalLineItemQuantity,
      items: cart.lineItems,
    }));
  };

  const handlerQuantity = (newVersion: number, newQuantity: number) => {
    updateCartContext(cartContext, (response) => ({
      ...response,
      version: newVersion,
      quantity: newQuantity,
    }));
  };

  const removeCart = async (userId: string, cartId: string, version: number) => {
    await deleteCart(userId, cartId, version);
    setVersion(1);
    setAnswer(`The cart is empty.Please, go to`);
    updateCartContext(cartContext, (responce) => ({
      ...responce,
      id: '',
      quantity: 0,
      version: 1,
      items: [],
    }));
    setItems([]);
    setTotal(undefined);
  };

  const [promo, setPromo] = useState('');

  const handleChange = (event: HTMLInputElement) => {
    setPromo(event.value);
  };

  const checkDiscount = async () => {
    const response = await cartDiscounts(userId);
    const arr = response.body.results.map((item) => item.key);
    if (arr.includes(promo)) {
      const { body: cart } = await addDiscount(userId, cartId, version, promo);
      setVersion(cart.version);
      updateCartContext(cartContext, (response) => ({
        ...response,
        version: cart.version,
      }));
    }
  };

  const oldPrice = (() => {
    if (items) {
      return items.reduce((sum, item) => sum + item.price.value.centAmount * item.quantity, 0);
    }
    return 0;
  })();

  useEffect((): void => {
    cartContext.id ? void findCart(userId) : setAnswer(`The cart is empty.Please, go to`);
  }, [cartContext, cartContext.id, userId]);

  /* eslint-disable no-console */
  console.log(cartId, version);

  return (
    <>
      <div>
        {answer && (
          <p>
            {answer}{' '}
            <Link className='basket__main-link' to={'/products'}>
              catalog
            </Link>
          </p>
        )}
        <div>
          {items?.map((item, key) => (
            <div key={key} className='basket__item'>
              <div className='basket__col'>
                <img
                  className='basket__item-img'
                  alt={item.name['en-US']}
                  src={item.variant.images ? item.variant.images[0].url : '../assets/open.png'}
                />
              </div>
              <div className='basket__col--lg'>
                {' '}
                <Link className='basket__item-name' to={`/products/${item.id}`}>
                  {item.name['en-US']}
                </Link>
              </div>
              <div className='basket__item-price'>
                <span>
                  {(item.price.value.centAmount / 100).toFixed(item.price.value.fractionDigits)}
                </span>
              </div>
              <Quantity
                userId={userId}
                cartsId={cartId}
                lineItemId={item.id}
                version={version}
                quantity={item.quantity}
                handlerQuantity={handlerQuantity}
              />
              <div className='basket__item-totalprice'>
                Total price:{' '}
                {(item.totalPrice.centAmount / 100).toFixed(item.price.value.fractionDigits)}
              </div>
              <button onClick={() => removeLine(item.id)}>Remove</button>
            </div>
          ))}
          <div>
            <p>Total sum</p>
            {oldPrice && (
              <span className='basket__item-oldprice'>
                {total && (oldPrice / 100).toFixed(total.fractionDigits)}
              </span>
            )}
            {(total && (total.centAmount / 100).toFixed(total.fractionDigits)) ?? 0}
          </div>
          <form>
            <input
              type='text'
              id='discount'
              name='discount'
              onChange={(e) => handleChange(e.currentTarget)}
            />
            <button type='button' onClick={checkDiscount}>
              Apply
            </button>
          </form>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you wish to delete this cart?'))
                void removeCart(userId, cartId, version);
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </>
  );
}
