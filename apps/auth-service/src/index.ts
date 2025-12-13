import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { Send } from "@repo/response";
import userRoute from "./routes/user.route";
import { AdminRoute } from "./middleware/auth.middleware";
import { producer } from "./utils/kafka";
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response) => {
  return Send.status200(res, "Auth-Service is healthy", {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/users", AdminRoute, userRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return Send.status500(res, "Internal Server Error", { error: err.message });
});
const port = process.env.PORT || 5003;

const start = async () => {
  try {
    await producer.connect();
    app.listen(port, () => {
      console.log(`Auth service is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
