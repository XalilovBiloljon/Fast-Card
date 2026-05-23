import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type IProduct } from '../components/ProductCard';

interface WishlistState {
  items: IProduct[];
}

const loadWishlistState = (): IProduct[] => {
  try {
    const serializedState = localStorage.getItem('wishlist-storage');
    if (serializedState === null) return [];
    const parsed = JSON.parse(serializedState);
    return parsed.state ? parsed.state.items : parsed.items || [];
  } catch (err) {
    return [];
  }
};

const initialState: WishlistState = {
  items: loadWishlistState(),
};

const saveWishlistState = (items: IProduct[]) => {
  localStorage.setItem('wishlist-storage', JSON.stringify({ state: { items } }));
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<IProduct>) => {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
        saveWishlistState(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistState(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistState(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
