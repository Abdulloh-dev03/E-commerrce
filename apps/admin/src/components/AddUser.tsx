"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
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
import { useAuth } from "@clerk/nextjs";
import { useAddUserMutation } from "@/redux/usersApi";
import { message } from "antd";
import { UserFormSchema } from "@repo/types";


const AddUser = () => {
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      username:"",
      emailAddress: [],
    },
  });

  const { getToken } = useAuth();
  
    const [addUser, { isLoading }] = useAddUserMutation();
  
    const handleAddUser = async (
      data: z.infer<typeof UserFormSchema>
    ) => {
      try {
        const token = await getToken();
        if (!token) {
          message.error("You must be logged in");
          return;
        }
        await addUser({ user:data, token }).unwrap();
        message.success("User created successfully");
        form.reset();
        } catch (error: any) {
        console.error("Failed to add user:", error);
        message.error(error.data?.message || "Failed to add user");
      }
    };


  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Add User</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form 
            className="space-y-8"
            onSubmit={form.handleSubmit(handleAddUser)}>  
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter user first name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter user last name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field}  
                      placeholder="email1@gmail.com, email2@gmail.com"
                      onChange={(e) => {
                        const emails = e.target.value
                        .split(",")
                        .map((email) => email.trim())
                        .filter((email) => email);
                        field.onChange(emails);
                      }}/>
                    </FormControl>
                    <FormDescription>
                      Enter user email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password"/>
                    </FormControl>
                    <FormDescription>
                      Enter user password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                  type="submit"
                  disabled={isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddUser;
