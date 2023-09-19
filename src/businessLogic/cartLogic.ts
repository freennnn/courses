import type { Cart, LineItem } from '@commercetools/platform-sdk';
import { addItemToCart, createAnonymousCart, createUserCart, removeItem } from 'api/api.ts';

// Item (aka LineItem) - variant of Product in Cart
export async function addProductToCart({
  productId,
  userId,
  cartId,
  cartVersion,
  onAddProductToCart,
}: {
  productId: string;
  userId: string; // I would have made userId optional (nullable), but we have '' default value in AuthContext
  cartId: string; // default '' instead of null
  cartVersion: number; // default 1 instead of null
  onAddProductToCart: (arg: {
    cartVersion: number;
    cartItems: LineItem[];
    cartItemsQuantity?: number;
    cartId?: string;
  }) => void;
}) {
  let updatedCart: Cart;
  if (!cartId) {
    let newCart: Cart;
    if (userId) {
      newCart = (await createUserCart()).body;
    } else {
      newCart = (await createAnonymousCart()).body;
    }
    updatedCart = (await addItemToCart(userId, newCart.id, productId, newCart.version)).body;
  } else {
    updatedCart = (await addItemToCart(userId, cartId, productId, cartVersion)).body;
  }

  onAddProductToCart({
    cartVersion: updatedCart.version,
    cartItems: updatedCart.lineItems,
    cartItemsQuantity: updatedCart.totalLineItemQuantity,
    cartId: updatedCart.id,
  });
}

export async function removeProductFromCart({
  lineItemId,
  userId,
  cartId,
  cartVersion,
  onRemoveProductFromCart,
}: {
  lineItemId: string;
  userId: string;
  cartId: string;
  cartVersion: number;
  onRemoveProductFromCart: (arg: {
    cartVersion: number;
    cartItems: LineItem[];
    cartItemsQuantity?: number;
  }) => void;
}) {
  const { body: updatedCart } = await removeItem(userId, cartId, lineItemId, cartVersion);
  onRemoveProductFromCart({
    cartVersion: updatedCart.version,
    cartItemsQuantity: updatedCart.totalLineItemQuantity,
    cartItems: updatedCart.lineItems,
  });
}
