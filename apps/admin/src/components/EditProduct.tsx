"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { ProductFormSchema, CategoryAttribute, ProductType } from "@repo/types";
import { useGetCategoriesQuery } from "@/redux/categoryApi";
import { useUpdateProductMutation } from "@/redux/productsApi";
import { useAuth } from "@clerk/nextjs";
import { message, Upload } from "antd";
import type { UploadFile } from "antd";
import {  useState } from "react";
import { UploadIcon, Plus, X } from "lucide-react";
import { Label } from "./ui/label";
import { useUploadImageToCloudinaryMutation } from "@/redux/cloudinaryApi";

type ProductFormValues = z.infer<typeof ProductFormSchema>;

interface EditProductProps {
  product: ProductType;
}

const EditProduct = ({ product }: EditProductProps) => {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [uploadImage] = useUploadImageToCloudinaryMutation();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { getToken } = useAuth();
  const [colorInput, setColorInput] = useState<string>("");
  const initialColors = product.variants?.map((v) => v.color) || [];
  const initialImages: Record<string, string[]> = {};
  product.variants?.forEach((v) => {
    initialImages[v.color] = v.images || [];
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: Number(product.price),
      categorySlug: product.categorySlug,
      attributes: (product.attributes as any) || {},
      variants: [{ colors: initialColors, images: initialImages }],
    },
  });

  const selectedCategorySlug = form.watch("categorySlug");
  const selectedCategory = categories.find(
    (c) => c.slug === selectedCategorySlug
  );
  const selectedCategoryAttributes =
    (selectedCategory?.attributes as unknown as CategoryAttribute[]) || [];

  const colors = form.watch("variants.0.colors") || [];

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const token = await getToken();
      if (!token) {
        message.error("You must be logged in to update a product");
        return;
      }

      const variantGroup = data.variants[0];
      if (!variantGroup || !variantGroup.colors) {
        message.error("Variant data is incomplete");
        return;
      }

      const transformedVariants = variantGroup.colors.map((color: string) => ({
        color,
        images: (variantGroup.images[color] as string[]) || [],
      }));

      const productPayload = {
        ...product,
        ...data,
        variants: transformedVariants,
      };

      await updateProduct({ product: productPayload as any, token }).unwrap();
      message.success("Product updated successfully");
      // Optional: Close sheet
    } catch (error) {
      console.error("Failed to update product:", error);
      message.error(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update product"
      );
    }
  };

  return (
    <SheetContent className="w-96 sm:max-w-[800px]">
      <ScrollArea className="h-screen pr-4">
        <SheetHeader>
          <SheetTitle className="mb-4">Edit Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pb-20"
              >
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-semibold text-lg">Product Information</h3>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g., Vintage Cotton T-Shirt"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brief, 1-line summary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed product specifications and features."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categorySlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select product category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={cat.slug}
                                  className="cursor-pointer"
                                >
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedCategoryAttributes.length > 0 && (
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        Product Attributes
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="selectAllAttributes"
                          className="cursor-pointer"
                          onCheckedChange={(checked) => {
                            const newAttributes: Record<string, string[]> = {};
                            if (checked) {
                              selectedCategoryAttributes.forEach((attr) => {
                                newAttributes[attr.key] = attr.options;
                              });
                            } else {
                              selectedCategoryAttributes.forEach((attr) => {
                                newAttributes[attr.key] = [];
                              });
                            }
                            form.setValue("attributes", newAttributes, {
                              shouldDirty: true,
                            });
                          }}
                        />
                        <Label
                          htmlFor="selectAllAttributes"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Select All
                        </Label>
                      </div>
                    </div>
                    {/* Map over attributes */}
                    {selectedCategoryAttributes.map((attr) => (
                      <FormField
                        key={attr.key}
                        control={form.control}
                        name={`attributes.${attr.key}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              {attr.label}
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-wrap gap-4 pt-1">
                                {attr.options.map((option: string) => (
                                  <div
                                    key={option}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`${attr.key}-${option}`}
                                      className="cursor-pointer"
                                      checked={(
                                        (field.value as string[]) || []
                                      ).includes(option)}
                                      onCheckedChange={(checked) => {
                                        const current =
                                          (field.value as string[]) || [];
                                        if (checked) {
                                          field.onChange([...current, option]);
                                        } else {
                                          field.onChange(
                                            current.filter((v) => v !== option)
                                          );
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`${attr.key}-${option}`}
                                      className="text-sm font-normal cursor-pointer"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-semibold text-lg">
                    Products: Colors & Images
                  </h3>

                  {/* 1. Color Input Field */}
                  <FormField
                    control={form.control}
                    name="variants.0.colors"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Type Color Name</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="(e.g., Deep Blue, Forest Green)"
                                  value={colorInput}
                                  onChange={(e) =>
                                    setColorInput(e.target.value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      const value = colorInput.trim();
                                      if (value && !colors.includes(value)) {
                                        field.onChange([...colors, value]);
                                        setColorInput("");
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const value = colorInput.trim();
                                    if (value && !colors.includes(value)) {
                                      field.onChange([...colors, value]);
                                      setColorInput("");
                                    }
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>

                              {colors.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {colors.map((color: string) => (
                                    <span
                                      key={color}
                                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-primary/10 dark:bg-primary/20"
                                    >
                                      {color}
                                      <button
                                        type="button"
                                        className="text-muted-foreground hover:text-primary cursor-pointer"
                                        onClick={() => {
                                          const updatedColors = colors.filter(
                                            (c: string) => c !== color
                                          );
                                          field.onChange(updatedColors);
                                          const images =
                                            form.getValues("variants.0.images");
                                          if (images) {
                                            const newImages = { ...images };
                                            delete newImages[color];
                                            form.setValue(
                                              "variants.0.images",
                                              newImages
                                            );
                                          }
                                        }}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-base">
                      Assign Images to Colors
                    </h4>

                    {colors.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Define colors above to start assigning images.
                      </p>
                    )}

                    {colors.map((color: string) => (
                      <FormField
                        key={color}
                        control={form.control}
                        name={`variants.0.images.${color}`}
                        render={({ field }) => {
                          const currentUrls = (field.value as string[]) || [];
                          const fileList: UploadFile[] = currentUrls.map(
                            (url: string, idx: number) => ({
                              uid: `${color}-${idx}`,
                              name:
                                url.split("/").pop() || `image-${idx + 1}.jpg`,
                              status: "done" as const,
                              url,
                            })
                          );

                          return (
                            <FormItem className="border p-3 rounded-md">
                              {/* LABEL + UPLOAD BUTTON ON SAME ROW */}
                              <div className="flex items-center justify-between mb-2">
                                <FormLabel className="flex items-center gap-3 font-medium text-base">
                                  <div
                                    className="w-5 h-5 rounded-full border border-gray-400 dark:border-gray-600 shadow-sm"
                                    style={{
                                      backgroundColor:
                                        color
                                          .toLowerCase()
                                          .replace(/\s/g, "") || "#ccc",
                                    }}
                                  />
                                  {color}
                                </FormLabel>

                                <Upload
                                  multiple
                                  showUploadList={false}
                                  beforeUpload={async (file) => {
                                    const result =
                                      await uploadImage(file).unwrap();
                                    field.onChange([
                                      ...currentUrls,
                                      result.secure_url,
                                    ]);
                                    return false;
                                  }}
                                >
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="cursor-pointer"
                                  >
                                    <UploadIcon className="w-4 h-4 mr-2" />
                                    Upload
                                  </Button>
                                </Upload>
                              </div>

                              {/* TEXT LIST MODE FOR DISPLAYING UPLOADED URLs */}
                              <FormControl>
                                <Upload
                                  multiple
                                  listType="text"
                                  fileList={fileList}
                                  beforeUpload={() => false}
                                  onRemove={(file) => {
                                    const urlToRemove = file.url;
                                    field.onChange(
                                      currentUrls.filter(
                                        (u) => u !== urlToRemove
                                      )
                                    );
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                {/* --- END COLORS & IMAGES --- */}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer"
                >
                  {isLoading ? "Updating Product..." : "Update Product"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default EditProduct;
