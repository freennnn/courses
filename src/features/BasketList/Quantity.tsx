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
  const [disabled, setDisabled] = useState<boolean>(false);

  const changeQuantity = async (count: number) => {
    const { body: cart } = await updateQuantity(userId, cartsId, lineItemId, version, count);
    handlerQuantity(cart.version, cart.totalLineItemQuantity ?? 0);
  };

  const incrementHandler = () => {
    const data = count + 1;
    setCount(data);
    void changeQuantity(data);
    if (data > 0) {
      setDisabled(false);
    }
  };

  const decrementHandler = () => {
    const data = count - 1;
    setCount(data);
    void changeQuantity(data);
    if (data === 0) {
      setDisabled(true);
    }
  };

  return (
    <div>
      <button disabled={disabled} onClick={decrementHandler}>
        -
      </button>

      <span>{count}</span>

      <button onClick={incrementHandler}>+</button>
    </div>
  );
};

export default Quantity;
