import { createConsumer, createKafkaClient } from "@repo/kafka";
import { sendGmail } from "./utils/mailer";

const kafka = createKafkaClient("email-service");
const consumer = createConsumer(kafka, "email-service");

const start = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe([
      {
        topicName: "user.created",
        topicHandler: async (message) => {
          const { email, username } = message.value;
          if (email) {
            await sendGmail(
              email,
              "Welcome to our E-commerce app",
              `Hello ${username}. Your account has been created successfully!`
            );
          }
        },
      },
      {
        topicName: "order.created",
        topicHandler: async (message) => {
          const { email, amount, status } = message.value;
          if (email) {
            await sendGmail(
              email,
              "Order has been created",
              `Hello, Thank you for your order! Your Order: Amount ${amount / 100}$, Status ${status}.`
            );
          }
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

start();
