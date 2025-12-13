import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderChartType, OrderType } from "@repo/types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<OrderType[], { limit?: number; token: string }>({
      query: ({ token, ...params }) => ({
        url: "/orders",
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getOrderChart: builder.query<OrderChartType[], string>({
      query: (token) => ({
        url: "/order-chart",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderChartQuery } = orderApi;
