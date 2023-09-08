import { createContext } from 'react';

interface CartContextValues {
  id: string;
  quantity: number;
}

interface SetCartContextFunction {
  setCartContext: (data: CartContextValues) => void;
}

type CartContext = CartContextValues & SetCartContextFunction;

// Add new app context variables here
export const defaultCartContextValues: CartContextValues = {
  id: '',
  quantity: 0,
};

export const defaultContext: CartContext = {
  ...defaultCartContextValues,
  /* eslint-disable-next-line no-console */
  setCartContext: (data) => console.log(data),
};

export const CartContext = createContext(defaultContext);

/**
 * Updates global application context
 * @param {CartContext} cartContext - global application context
 * @param {Partial<CartContextValues>} values - context fields which we want to update
 */
export const updateCartContext = (cartContext: CartContext, values: Partial<CartContextValues>) => {
  cartContext.setCartContext({
    ...cartContext,
    ...values,
  });
};
