import { createConsumer, createKafkaClient, createProducer } from '@repo/kafka';

const kafkaClient = createKafkaClient("Order-service")

export const producer = createProducer(kafkaClient)
export const consumer = createConsumer(kafkaClient,"order-group")

