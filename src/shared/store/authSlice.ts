import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

const loadAuthState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem('auth-storage');
    if (serializedState === null) return { isAuthenticated: false, token: null };
    const parsed = JSON.parse(serializedState);
    const state = parsed.state || parsed;
    return {
      isAuthenticated: state.isAuthenticated || false,
      token: state.token || null
    };
  } catch (err) {
    return { isAuthenticated: false, token: null };
  }
};

const initialState: AuthState = loadAuthState();

const saveAuthState = (state: AuthState) => {
  localStorage.setItem('auth-storage', JSON.stringify({ state }));
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      saveAuthState(state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      saveAuthState(state);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
