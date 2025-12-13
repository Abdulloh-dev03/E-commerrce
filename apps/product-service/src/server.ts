import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware, getAuth } from '@clerk/express'
import { protectedRoute } from './middleware/auth.middleware.js'
import productRouter from './routes/product.route.js'
import categoryRouter from './routes/category.route.js'
import { Send } from "@repo/response";
import { consumer, producer } from './utils/kafka.js'
const app = express()
app.use(express.json())

app.use(cors({
    origin: [process.env.CLIENT_HOST as string,process.env.ADMIN_HOST as string],
    credentials: true
}))
app.use(express.json());
app.use(clerkMiddleware());

app.get('/health', (req: Request, res: Response) => {
  return Send.status200(res, 'Product-Service is healthy', {
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.get('/test', protectedRoute,(req:Request,res:Response) => {
    return Send.status200(res, 'Product-service is authenticated', { userId: req.userId });
})

app.use('/products', productRouter)
app.use('/categories',categoryRouter)

app.use((err:any, req:Request,res:Response,next:NextFunction) => {
  console.error(err);
  return Send.status500(res, 'Internal Server Error', { error: err.message });
})
const port = process.env.PORT || 5000;


const start = async () => {
  try {
    Promise.all([await producer.connect(), await consumer.connect() ])
    app.listen(port, () => {
      console.log(`Product service is running on http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error)   
    process.exit(1);
  }
}

start();
