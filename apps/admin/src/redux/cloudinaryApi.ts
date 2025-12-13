// src/redux/cloudinaryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryApi = createApi({
  reducerPath: "cloudinaryApi",
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    uploadImageToCloudinary: builder.mutation<
      { secure_url: string },
      File
    >({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryUploadPreset ?? "");

        return {
          url: `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadImageToCloudinaryMutation } = cloudinaryApi;