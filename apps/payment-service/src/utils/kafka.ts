import { createConsumer, createKafkaClient, createProducer } from '@repo/kafka';

const kafkaClient = createKafkaClient("Payment-service")

export const producer = createProducer(kafkaClient)
export const consumer = createConsumer(kafkaClient,"payment-group")

