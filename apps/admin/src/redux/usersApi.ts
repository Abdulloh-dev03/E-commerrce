// admin/src/redux/usersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
  }),

  endpoints: (builder) => ({
    // GET ALL USERS
    getUsers: builder.query({
      query: (token) => ({
        url: "/users",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // GET USER BY ID
    getUserById: builder.query({
      query: ({ id, token }) => ({
        url: `/users/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ADD USER
    addUser: builder.mutation({
      query: ({ user, token }) => ({
        url: "/users",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: user,
      }),
    }),

    // DELETE USER
    deleteUser:builder.mutation({
      query:({id,token})=>({
        url:`/users/${id}`,
        method:"DELETE",
        headers:{
          Authorization:`Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { 
  useGetUsersQuery, 
  useGetUserByIdQuery, 
  useAddUserMutation,
  useDeleteUserMutation} = usersApi;
