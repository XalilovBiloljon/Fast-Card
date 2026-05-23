import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type IProduct } from '../components/ProductCard';

export interface ICartItem extends IProduct {
  cartQuantity: number;
}

interface CartState {
  cartItems: ICartItem[];
}

const loadCartState = (): ICartItem[] => {
  try {
    const serializedState = localStorage.getItem('cart-storage');
    if (serializedState === null) return [];
    const parsed = JSON.parse(serializedState);
    // Mimic the Zustand persist migration logic
    const state = parsed.state || parsed; 
    return (state.cartItems || []).map((item: any) => ({
      ...item,
      cartQuantity: typeof item.cartQuantity === 'number' && item.cartQuantity >= 1
        ? item.cartQuantity
        : 1,
    }));
  } catch (err) {
    return [];
  }
};

const initialState: CartState = {
  cartItems: loadCartState(),
};

const saveCartState = (items: ICartItem[]) => {
  localStorage.setItem('cart-storage', JSON.stringify({ state: { cartItems: items }, version: 1 }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IProduct>) => {
      const existing = state.cartItems.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.cartQuantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, cartQuantity: 1 });
      }
      saveCartState(state.cartItems);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.cartItems.find((i) => i.id === action.payload.productId);
      if (item) {
        item.cartQuantity = Math.max(1, action.payload.quantity);
      }
      saveCartState(state.cartItems);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      saveCartState(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCartState(state.cartItems);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
