import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware } from '@hono/clerk-auth'
import { Send } from '@repo/response'
import {cors} from 'hono/cors';
import sessionRoute from './routes/session.routes';
import webhookRouter from './routes/webhooks.routes';
import { consumer, producer } from './utils/kafka';
import { runKafkaSubscriptions } from './utils/subscriptions';




const app = new Hono()
app.use('*', clerkMiddleware())

app.use('*',cors({
  origin:["http://localhost:3000"],
  credentials:true
}))

app.get('/health', (c) => {
  return Send.status200(c, 'Payment-Service is healthy', {
    uptime:process.uptime(),
    timestamp:Date.now(),
  })
})

app.route('/sessions',sessionRoute)
app.route('/webhooks',webhookRouter)


const start = async () => {
  try {
    await Promise.all([producer.connect(), consumer.connect()]);
    await runKafkaSubscriptions();
    serve({
      fetch: app.fetch,
      port: 4002
      }, (info) => {
        console.log(`Payment service is running on http://localhost:${info.port}`)
      })
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
start();