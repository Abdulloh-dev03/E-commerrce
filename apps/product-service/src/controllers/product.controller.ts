import { Request, Response } from "express";
import { producer } from "../utils/kafka";
import { Send } from "@repo/response";
import { prisma, Prisma } from "@repo/database";
import { StripeProductType } from "@repo/types";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      shortDescription,
      description,
      price,
      categorySlug,
      attributes,
      variants,
    } = req.body;

    if (!name || !shortDescription || !description || !price || !categorySlug) {
      return Send.status400(res, "Missing required product fields!");
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return Send.status400(res, "At least one variant is required!");
    }

    const prismaVariantData = variants.map((v: any) => ({
      color: v.color,
      images: v.images,
    }));

    const product = await prisma.product.create({
      data: {
        name,
        shortDescription,
        description,
        price: Number(price),
        categorySlug,
        attributes,
        variants: {
          create: prismaVariantData,
        },
      },
      include: {
        variants: true,
      },
    });

    const stripeProduct: StripeProductType = {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
    };

    await producer.send("product.created", {
      value: JSON.stringify(stripeProduct),
    });

    return Send.status201(res, "Product Created Successfully", product);
  } catch (err) {
    console.error(err);
    return Send.status500(res, "Internal server error", err);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return Send.status400(res, "Invalid product ID");
    }

    const {
      name,
      shortDescription,
      description,
      price,
      attributes,
      categorySlug,
      variants,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        shortDescription,
        description,
        price,
        attributes,
        categorySlug,

        variants: variants
          ? {
              deleteMany: {},
              create: variants.map((v: any) => ({
                color: v.color,
                images: v.images,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
      },
    });

    return Send.status200(res, "Product updated successfully", updatedProduct);
  } catch (error: any) {
    console.error("Update product error:", error);
    return Send.status500(res, "Failed to update product");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return Send.status400(res, "Invalid product ID");
    }

    await prisma.variant.deleteMany({
      where: { productId },
    });

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    await producer.send("product.deleted", {
      value: JSON.stringify(productId),
    });

    return Send.status200(res, "Product deleted successfully", deletedProduct);
  } catch (error: any) {
    console.error("Delete product error:", error);

    return Send.status500(res, "Failed to delete product");
  }
};

export const getAllProduct = async (req: Request, res: Response) => {
  const { sort, category, search, limit } = req.query;
  const orderBy = (() => {
    switch (sort) {
      case "asc":
        return { price: Prisma.SortOrder.asc };
        break;
      case "desc":
        return { price: Prisma.SortOrder.desc };
        break;
      case "oldest":
        return { createdAt: Prisma.SortOrder.asc };
        break;
      default:
        return { createdAt: Prisma.SortOrder.desc };
        break;
    }
  })();
  const where: Prisma.ProductWhereInput = {};
  if (typeof category === "string" && category && category !== "all") {
    where.category = { slug: category };
  }
  if (typeof search === "string" && search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }
  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: limit ? Number(limit) : undefined,
    include: { variants: true },
  });
  return Send.status200(res, "Products fetched succesfully", products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { variants: true },
  });
  return Send.status200(res, "Product fetched succesfully", product);
};
