import { useState } from 'react';

import { updateQuantity } from '../../api/api.ts';

interface Props {
  userId: string;
  cartsId: string;
  lineItemId: string;
  version: number;
  quantity: number;
  handlerQuantity: (version: number, quantity: number) => void;
}

const Quantity = ({ userId, cartsId, lineItemId, version, quantity, handlerQuantity }: Props) => {
  const [count, setCount] = useState<number>(quantity);

  const changeQuantity = async (count: number) => {
    try {
      const { body: cart } = await updateQuantity(userId, cartsId, lineItemId, version, count);
      handlerQuantity(cart.version, cart.totalLineItemQuantity ?? 0);
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
