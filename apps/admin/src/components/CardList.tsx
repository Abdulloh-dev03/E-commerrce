"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useGetProductsQuery } from "@/redux/productsApi";
import { OrderType, ProductType } from "@repo/types";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { useGetOrdersQuery } from "@/redux/orderApi";

const CardList = ({ title, token }: { title: string; token: string }) => {
  const { data: products, isLoading } = useGetProductsQuery({});
  const { data: orders } = useGetOrdersQuery({ token });
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Waveform size="35" stroke="3.5" speed="1" color="gray" />
      </div>
    );
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "Popular Products"
          ? products?.map((item: ProductType) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                  <Image
                    src={item.variants?.[0]?.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-0">${item.price}</CardFooter>
              </Card>
            ))
          : orders?.slice(0, 3).map((item: OrderType) => (
              <Card key={item._id}>
                <CardContent>
                  <CardTitle>{item.email}</CardTitle>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Badge variant="secondary">${item.amount / 100}</Badge>
                  <Badge variant="outline">{item.status}</Badge>
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default CardList;
