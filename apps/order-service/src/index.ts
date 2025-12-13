import "dotenv/config";
import Fastify from "fastify";
import CLerk from "@clerk/fastify";
import { protectedRoute } from "./middleware/auth.middleware.js";
import { Send } from "@repo/response";
import { connectDB } from "@repo/order-db";
import { orderRoutes } from "./routes/order.js";
import { consumer, producer } from "./utils/kafka.js";
import cors from "@fastify/cors";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";

const fastify = Fastify();
fastify.register(CLerk.clerkPlugin);

await fastify.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
});

fastify.get("/health", (request, reply) => {
  return Send.status200(reply, "Order-Service is healthy", {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

fastify.get("/test", { preHandler: protectedRoute }, (request, reply) => {
  return Send.status200(reply, "Order-service is authenticated", {
    userId: request.userId,
  });
});

fastify.register(orderRoutes);

const start = async () => {
  try {
    await Promise.all([connectDB(), producer.connect(), consumer.connect()]);
    await runKafkaSubscriptions();
    await fastify.listen({ port: 4001 });
    console.log("Order-Service is running http://localhost:", { port: 4001 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
start(); 
