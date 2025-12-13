import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from './productsApi';
import { categoryApi } from './categoryApi';
import { orderApi } from './orderApi'; 

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware, 
      categoryApi.middleware,
      orderApi.middleware 
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;