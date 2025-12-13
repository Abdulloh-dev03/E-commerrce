import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './productsApi';
import { categoryApi } from './categoryApi';
import { orderApi } from './orderApi';
import { usersApi } from './usersApi';
import { cloudinaryApi } from './cloudinaryApi';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer, 
    [usersApi.reducerPath]: usersApi.reducer,
    [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware, 
      categoryApi.middleware,
      orderApi.middleware,
      usersApi.middleware,
      cloudinaryApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;