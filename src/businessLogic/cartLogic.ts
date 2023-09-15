import { Cart, LineItem } from '@commercetools/platform-sdk';
import { addItemToCart, createAnonymousCart, createUserCart } from 'api/api.ts';

// Item (aka LineItem) - variant of Product in Cart
export async function addItem({
  productID,
  userID,
  cartID,
  cartVersion,
  onAddProductToCart: cartContextUpdatingFunction,
}: {
  productID: string;
  userID: string; // I would have made userID optional (nullable), but we have '' default value in AuthContext
  cartID: string; // default '' instead of null
  cartVersion: number; // default 1 instead of null
  onAddProductToCart: (arg: {
    cartVersion: number;
    cartItems: LineItem[];
    cartItemsQuantity?: number;
    cartID?: string;
  }) => void;
}) {
  let updatedCart: Cart;
  if (!cartID) {
    let newCart: Cart;
    if (userID) {
      newCart = (await createUserCart()).body;
    } else {
      newCart = (await createAnonymousCart()).body;
    }
    updatedCart = (await addItemToCart(userID, newCart.id, productID, newCart.version)).body;
  } else {
    updatedCart = (await addItemToCart(userID, cartID, productID, cartVersion)).body;
  }

  cartContextUpdatingFunction({
    cartVersion: updatedCart.version,
    cartItems: updatedCart.lineItems,
    cartItemsQuantity: updatedCart.totalLineItemQuantity,
    cartID: updatedCart.id,
  });
}
