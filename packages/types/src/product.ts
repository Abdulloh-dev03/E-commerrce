import { Category } from "@repo/database";
import z from "zod";

export type VariantType = {
  id: number;
  color: string;
  images: string[];
};

export type ProductAttributes = {
  [key: string]: string[] | number[];
};

export type ProductType = {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  attributes: ProductAttributes;
  createdAt: string;
  updatedAt: string;
  categorySlug: string;
  variants: VariantType[];
  stripeProductId: string | null;
  stripePriceId: string | null;
};

export type ProductsType = ProductType[];

export type StripeProductType = {
  id: string;
  name: string;
  price: number;
};

export type CategoryType = Category;

export const VariantFormSchema = z
  .object({
    colors: z
      .array(z.string().min(1, "Color name cannot be empty"))
      .min(1, "At least one color is required"),

    images: z.record(
      z.string(),
      z
        .array(
          z
            .string()
            .url("Must be a valid image URL")
            .startsWith(
              "https://res.cloudinary.com",
              "Must be a Cloudinary image"
            )
        )
        .min(1, "At least one image is required for this color")
    ),
  })
  .refine(
    (data) => {
      const missing = data.colors.filter(
        (color) => !data.images[color] || data.images[color].length === 0
      );
      return missing.length === 0;
    },
    {
      message: "Every color must have at least one image",
      path: ["images"],
    }
  );

// Product
export const ProductFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required!" }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required!" })
    .max(100),
  description: z.string().min(1, { message: "Description is required!" }),
  price: z.number().min(0.01, { message: "Price is required!" }),
  categorySlug: z.string().min(1, { message: "Category is required!" }),
  attributes: z.record(z.string(), z.array(z.union([z.string(), z.number()]))),
  variants: z.array(VariantFormSchema).min(1, "Variant is required"),
});

export type CategoryAttribute = {
  key: string;
  label: string;
  options: string[];
};

export const CategoryFormSchema = z.object({
  name: z
    .string({ message: "Name is Required!" })
    .min(1, { message: "Name is Required!" }),
  slug: z
    .string({ message: "Slug is Required!" })
    .min(1, { message: "Slug is Required!" }),
  attributes: z.array(
    z.object({
      key: z
        .string({ message: "At least one attribute is required!" })
        .min(1, { message: "Key is Required!" }),
      label: z
        .string({ message: "At least one label is required!" })
        .min(1, { message: "Label is Required!" }),
      options: z
        .array(z.string({ message: "At least one option is required!" }))
        .min(1, { message: "Options are Required!" }),
    })
  ),
});
