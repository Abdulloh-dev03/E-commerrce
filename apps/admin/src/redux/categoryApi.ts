import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CategoryType } from "@repo/types";

export type CategoryResponse = {
  data: CategoryType[];
};

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL,
    credentials: "include",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Get Categories
    getCategories: builder.query<CategoryType[], void>({
      query: () => "/categories",
      transformResponse: (response: CategoryResponse) => response.data,
      providesTags: [{ type: "Category", id: "LIST" }],
    }),

    // Add Category
    addCategory: builder.mutation<
      CategoryType,
      { category: Omit<CategoryType, "id">; token: string }
    >({
      query: ({ category, token }) => ({
        url: "/categories",
        method: "POST",
        body: category,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // Update Category
    updateCategory: builder.mutation<
      CategoryType,
      { category: CategoryType; token: string }
    >({
      query: ({ category, token }) => ({
        url: `/categories/${category.id}`,
        method: "PUT",
        body: category,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // Delete Category
    deleteCategory: builder.mutation<void, { id: number; token: string }>({
      query: ({ id, token }) => ({
        url: `/categories/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
