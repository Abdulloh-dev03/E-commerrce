// 1. Add 'retry' to your imports
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { ProductsType, ProductType } from '@repo/types';

type ProductQueryParams = {
  category?: string;
  search?: string;
  sort?: string;
};

// 2. Create a "staggered" or wrapped base query
const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
    credentials: "include",
    // Do NOT put retry here
  }),
  { maxRetries: 3 } // <-- 3. Configure retries here
);

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: staggeredBaseQuery, // <-- 4. Use the wrapped query here
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsType, ProductQueryParams>({
      query: ({ category, search, sort }) => {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append("category", category);
        if (search) params.append("search", search);
        if (sort) params.append("sort", sort);
        return `/products?${params.toString()}`
      },
      transformResponse: (response: { data: ProductsType }) => response.data,
    }),
    getProductById: builder.query<ProductType, number>({
      query: (id) => `products/${id}`,
      transformResponse: (response: { data: ProductType }) => response.data,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;