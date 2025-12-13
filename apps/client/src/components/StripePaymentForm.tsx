"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { useAuth } from "@clerk/nextjs";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";
import CheckoutForm from "./CheckoutForm";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import useCartStore from "@/stores/cartStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  try {
    const url =
      await `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`;
    console.log("Attempting to fetch from:", url);

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with:", response.status, errorText);
      throw new Error(
        `Failed to create checkout session: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();
    if (!json.checkoutSessionClientSecret) {
      console.error("Unexpected response format:", json);
      throw new Error("Invalid response from payment service");
    }

    return json.checkoutSessionClientSecret;
  } catch (error) {
    console.error("Error in fetchClientSecret:", error);
    throw error; // Re-throw to be caught by the component
  }
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    getToken().then((t: string | null) => setToken(t));
  }, [getToken]);

  useEffect(() => {
    if (token && cart.length > 0) {
      console.log("Fetching client secret with cart:", cart);
      setClientSecret(null);
      fetchClientSecret(cart, token)
        .then((secret) => {
          console.log("Successfully received client secret");
          setClientSecret(secret);
        })
        .catch((error) => {
          console.error("Failed to fetch client secret:", error);
        });
    }
  }, [token, cart]);

  if (!token || !clientSecret) {
    return (
      <div className="flex justify-center items-center h-40">
        <Grid size="100" speed="1.5" color="gray" />
      </div>
    );
  }

  return (
    <CheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
