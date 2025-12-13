import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CategoryType } from '@repo/types';

export type CategoryResponse = {
  data: CategoryType[];
};

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryType[], void>({
      query: () => '/categories',
      transformResponse: (response: CategoryResponse) => response.data,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
