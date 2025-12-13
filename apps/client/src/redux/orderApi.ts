import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderType } from "@repo/types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL,
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<OrderType[], string>({
      query: (token) => ({
        url: '/user-orders',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      }),
    }),
  }),
});

export const { useGetOrdersQuery } = orderApi;