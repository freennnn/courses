import { useEffect, useState } from 'react';

import { LineItem } from '@commercetools/platform-sdk';

import { updateQuantity } from '../../api/api.ts';

interface Props {
  userId: string;
  cartsId: string;
  lineItemId: string;
  version: number;
  quantity: number;
  handlerQuantity: (version: number, quantity: number, lineItems: LineItem[]) => void;
}

const Quantity = ({ userId, cartsId, lineItemId, version, quantity, handlerQuantity }: Props) => {
  const [count, setCount] = useState<number>(quantity);
  const changeQuantity = async (count: number) => {
    try {
      const { body: cart } = await updateQuantity(userId, cartsId, lineItemId, version, count);
      handlerQuantity(cart.version, cart.totalLineItemQuantity ?? 0, cart.lineItems);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(`The quantity is wrong, check your numbers`);
    }
  };

  const countHandler = (num: number) => {
    const data = count + num;
    setCount(data);
    changeQuantity(data);
  };

  useEffect(() => {
    setCount(quantity);
  }, [quantity, lineItemId]);

  return (
    <div className='basket__inline-flex'>
      <button className='basket__btn' onClick={() => countHandler(-1)}>
        -
      </button>
      <span>{count}</span>
      <button className='basket__btn' onClick={() => countHandler(1)}>
        +
      </button>
    </div>
  );
};

export default Quantity;
