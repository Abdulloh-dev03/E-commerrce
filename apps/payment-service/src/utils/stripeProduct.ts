import { StripeProductType } from "@repo/types";
import stripe from "./stripe";

export const createStripeProduct = async (item: StripeProductType) => {
  try {
    const res = await stripe.products.create({
      id: item.id,
      name: item.name,
      default_price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStripeProductPrice = async (productId: number) => {
  try {
    const res = await stripe.prices.list({
      product: productId.toString(),
    });
    const price = res.data[0]?.unit_amount;
    if (price === undefined || price === null) {
      throw new Error(`No price found for product ${productId}`);
    }
    return price;
  } catch (error) {
    console.log("Error fetching stripe product price:", error);
    throw error;
  }
};

export const deleteStripeProduct = async (productId: number) => {
  try {
    const res = await stripe.products.del(productId.toString());
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};