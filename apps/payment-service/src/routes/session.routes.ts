import { Hono } from "hono";
import stripe from "../utils/stripe";
import { CartItemsType } from "@repo/types";
import { protectedRoute } from "../middleware/auth.middleware";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", protectedRoute, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get("userId");

  console.log(
    "Creating checkout session for cart:",
    JSON.stringify(cart, null, 2)
  );

  const lineItems = cart.map((item) => {
    if (item.stripePriceId) {
      return {
        price: item.stripePriceId,
        quantity: item.quantity,
      };
    }
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      payment_method_types: ["card"],
      ui_mode: "custom",
      return_url: `${process.env.CLIENT_HOST}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    // console.log(session);

    return c.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    }
  );

  console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
