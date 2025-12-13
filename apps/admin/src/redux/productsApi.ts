import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import type { ProductsType, ProductType } from "@repo/types";

type ProductQueryParams = {
  category?: string;
  search?: string;
  sort?: string;
};

const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
    credentials: "include",
  }),
  { maxRetries: 3 }
);

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: staggeredBaseQuery,
  refetchOnMountOrArgChange: true,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsType, ProductQueryParams>({
      query: () => `products`,
      transformResponse: (response: { data: ProductsType }) => response.data,
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
    getProductById: builder.query<ProductType, number>({
      query: (id) => `products/${id}`,
      transformResponse: (response: { data: ProductType }) => response.data,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    addProduct: builder.mutation<
      ProductType,
      { product: Omit<ProductType, "id">; token: string }
    >({
      query: ({ product, token }) => ({
        url: "/products",
        method: "POST",
        body: product,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      ProductType,
      { product: ProductType; token: string }
    >({
      query: ({ product, token }) => ({
        url: `/products/${product.id}`,
        method: "PUT",
        body: product,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (result, error, { product }) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id: product.id },
      ],
    }),
    deleteProduct: builder.mutation<void, { id: number; token: string }>({
      query: ({ id, token }) => ({
        url: `/products/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
