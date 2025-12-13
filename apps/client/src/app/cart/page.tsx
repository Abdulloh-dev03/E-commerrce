"use client";

import ShippingForm from "@/components/ShippingForm";
import StripePaymentForm from "@/components/StripePaymentForm";
import useCartStore from "@/stores/cartStore";
import { ShippingFormInputs } from "@repo/types";
import { ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const steps = [
  { id: 1, title: "Shopping Cart" },
  { id: 2, title: "Shipping Address" },
  { id: 3, title: "Payment Method" },
];

const CartPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();

  const activeStep = parseInt(searchParams.get("step") || "1");
  const { cart, removeFromCart, updateQuantity } = useCartStore();

  const calculateSubtotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      {/* TITLE */}
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        Your Shopping Cart
      </h1>

      {/* STEPS */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map((step) => (
          <div
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              step.id === activeStep
                ? "border-gray-800 dark:border-gray-300"
                : "border-gray-200 dark:border-gray-700"
            }`}
            key={step.id}
          >
            <div
              className={`w-6 h-6 rounded-full text-white dark:text-gray-900 p-4 flex items-center justify-center ${
                step.id === activeStep
                  ? "bg-gray-800 dark:bg-gray-200"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep
                  ? "text-gray-800 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>

      {/* STEPS & DETAILS */}
      <div className="w-full flex flex-col lg:flex-row gap-16">
        {/* LEFT: Cart / Form / Payment */}
        <div className="w-full lg:w-7/12 shadow-md border dark:border-none bg-white dark:bg-zinc-800 p-8 rounded-lg flex flex-col gap-8">
          {activeStep === 1 ? (
            cart.length > 0 ? (
              cart.map((item) => {
                const variantForColor = item.variants?.find(
                  (v) => String(v.color) === item.selectedColor
                );
                const imageSrc =
                  variantForColor?.images?.[0] ||
                  item.variants?.[0]?.images?.[0] ||
                  "/placeholder.png";

                return (
                  <div
                    className="flex items-center justify-between"
                    key={`${item.id}-${JSON.stringify(item.selectedAttributes)}-${item.selectedColor}`}
                  >
                    {/* IMAGE AND DETAILS */}
                    <div className="flex gap-8">
                      {/* IMAGE */}
                      <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          fill
                          sizes="128px"
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      {/* ITEM DETAILS */}
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.name}
                          </p>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Quantity:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                className="cursor-pointer ring-1 ring-gray-300 dark:ring-neutral-700 p-1 rounded"
                                onClick={() => updateQuantity(item, "decrement")}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="min-w-6 text-center text-sm text-gray-900 dark:text-gray-100">
                                {item.quantity}
                              </span>
                              <button
                                className="cursor-pointer ring-1 ring-gray-300 dark:ring-neutral-700 p-1 rounded"
                                onClick={() => updateQuantity(item, "increment")}
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* DYNAMIC ATTRIBUTES */}
                          {Object.keys(item.selectedAttributes || {}).map((key) => (
                            <p
                              key={key}
                              className="text-xs text-gray-500 dark:text-gray-400 capitalize"
                            >
                              {key}: {item.selectedAttributes[key]}
                            </p>
                          ))}

                          {/* OPTIONAL COLOR */}
                          {item.selectedColor && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Color: {item.selectedColor}
                            </p>
                          )}
                        </div>

                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => removeFromCart(item)}
                      className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300 text-red-500 dark:text-red-300 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Your cart is empty.
              </p>
            )
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            <StripePaymentForm shippingForm={shippingForm} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please fill in the shipping form to continue.
            </p>
          )}
        </div>

        {/* RIGHT: Cart Summary */}
        <div className="w-full lg:w-5/12 shadow-lg border-1 border-gray-100 dark:border-gray-800 bg-white dark:bg-zinc-800 p-8 rounded-lg flex flex-col gap-8 h-max">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            Cart Details
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                ${calculateSubtotal().toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">Discount(10%)</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">$10</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500 dark:text-gray-400">Shipping Fee</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">$10</p>
            </div>
            <hr className="border-gray-200 dark:border-gray-800" />
            <div className="flex justify-between">
              <p className="text-gray-800 dark:text-gray-100 font-semibold">Total</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                ${(calculateSubtotal() + 10 /* shipping */ - 10 /* discount */).toFixed(2)}
              </p>
            </div>
          </div>

          {activeStep === 1 && cart.length > 0 && (
            <button
              onClick={() => router.push("/cart?step=2", { scroll: false })}
              className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-100 dark:hover:bg-white transition-all duration-300 text-white dark:text-gray-900 p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
