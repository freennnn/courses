import { createContext } from 'react';

import { LineItem } from '@commercetools/platform-sdk';

interface CartContextValues {
  id: string;
  quantity: number;
  version: number;
  items: LineItem[];
}

interface SetCartContextFunction {
  setCartData: (data: CartContextValues) => void;
}

type CartContext = CartContextValues & SetCartContextFunction;

// Add new app context variables here
export const defaultCartContextValues: CartContextValues = {
  id: '',
  quantity: 0,
  version: 1,
  items: [],
};

export const defaultContext: CartContext = {
  ...defaultCartContextValues,
  /* eslint-disable-next-line no-console */
  setCartData: (data) => console.log(data),
};

export const CartContext = createContext(defaultContext);

/**
 * Updates global application context
 * @param {CartContext} cartContext - global application context
 * @param {Function} updateCallback - A callback function that receives the previous cart context and returns the changes to apply.
 */

export const updateCartContext = (
  cartContext: CartContext,
  updateCallback: (prev: CartContextValues) => Partial<CartContextValues>,
) => {
  const updatedValues = updateCallback(cartContext); // Call the callback with the current context

  cartContext.setCartData({
    ...cartContext,
    ...updatedValues, // Spread the updated values into the context
  });
};
