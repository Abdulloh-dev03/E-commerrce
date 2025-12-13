"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CategoryFormSchema, CategoryType } from "@repo/types";
import { useAuth } from "@clerk/nextjs";

import { message } from "antd";
import { ScrollArea } from "./ui/scroll-area";
import { useUpdateCategoryMutation } from "@/redux/categoryApi";

const EditCategories = ({ category }: { category: CategoryType }) => {
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: category.name || "",
      slug: category.slug || "",
      attributes: Array.isArray(category.attributes)
        ? (category.attributes as any)
        : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const { getToken } = useAuth();
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const handleUpdateCategory = async (
    data: z.infer<typeof CategoryFormSchema>
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        message.error("You must be logged in to update a category");
        return;
      }
      await updateCategory({
        category: { ...category, ...data },
        token,
      }).unwrap();
      message.success("Category updated successfully");
      // Optional: Close sheet if controlled from parent or if we have a callback
    } catch (error) {
      console.error("Failed to update category:", error);
      message.error(
        (error as any).data?.message || "Failed to update category"
      );
    }
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Edit Category</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(handleUpdateCategory)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Enter category name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Enter category slug.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Attributes</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() =>
                        append({ key: "", label: "", options: [] })
                      }
                    >
                      Add Attribute
                    </Button>
                  </div>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-md space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name={`attributes.${index}.key`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g. size, storage"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`attributes.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g. Size, Storage"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`attributes.${index}.options`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Options (comma separated)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value?.join(",") || ""}
                                onChange={(e) =>
                                  field.onChange(e.target.value.split(","))
                                }
                                placeholder="e.g. 16GB, 32GB or M, L, XL"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter options separated by commas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default EditCategories;
