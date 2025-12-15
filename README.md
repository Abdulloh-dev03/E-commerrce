<div align="center">

# 🛍️ Modern E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TurboRepo](https://img.shields.io/badge/TurboRepo-2.5-red?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)

**A full-stack, microservices-based e-commerce platform built with modern web technologies**

[🌐 Live Demo](#-live-deployment) • [📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎨 **Client Features**

- 🛒 **Shopping Cart** - Seamless cart management with Zustand
- 💳 **Secure Payments** - Stripe integration for safe transactions
- 🔐 **Authentication** - Clerk-powered user authentication
- 🎯 **Product Filtering** - Advanced search and filter capabilities
- 📱 **Responsive Design** - Beautiful UI with Tailwind CSS v4
- 🌓 **Dark Mode** - Theme switching with next-themes
- ✨ **Animations** - Smooth transitions with GSAP and Framer Motion
- 🎨 **Modern UI** - Radix UI components with shadcn/ui

### 🔧 **Admin Dashboard**

- 📊 **Analytics** - Real-time sales and product analytics with Recharts
- 📦 **Product Management** - Full CRUD operations for products
- 🏷️ **Category Management** - Organize products by categories
- 🖼️ **Image Upload** - Cloudinary integration for media management
- 📈 **Order Tracking** - Monitor and manage customer orders
- 👥 **User Management** - Admin controls with Clerk

### ⚙️ **Backend Services**

- 🔐 **Auth Service** - Centralized authentication with Clerk
- 🛍️ **Product Service** - Product and category management
- 💰 **Payment Service** - Stripe payment processing
- 📦 **Order Service** - Order management and tracking
- 📧 **Email Service** - Automated email notifications
- 🔄 **Event-Driven** - Kafka-based microservices communication

---

## 🏗️ Architecture

This project follows a **microservices architecture** using a **monorepo** structure powered by **TurboRepo**.

```
E-commerce/
├── apps/
│   ├── client/          # Customer-facing Next.js app (Port 3000)
│   ├── admin/           # Admin dashboard Next.js app (Port 3001)
│   ├── auth-service/    # Authentication microservice (Express)
│   ├── product-service/ # Product management service (Express)
│   ├── payment-service/ # Stripe payment service (Hono)
│   ├── order-service/   # Order management service (Express)
│   └── email-service/   # Email notification service
│
└── packages/
    ├── database/        # Prisma schema & PostgreSQL client
    ├── kafka/           # Kafka producer/consumer utilities
    ├── order-db/        # MongoDB order database
    ├── types/           # Shared TypeScript types
    ├── response/        # Standardized API responses
    ├── eslint-config/   # Shared ESLint configuration
    └── typescript-config/ # Shared TypeScript configuration
```

---

## 🛠️ Tech Stack

### **Frontend**

| Technology          | Purpose                         |
| ------------------- | ------------------------------- |
| **Next.js 16**      | React framework with App Router |
| **React 19**        | UI library                      |
| **TypeScript**      | Type safety                     |
| **Tailwind CSS v4** | Utility-first styling           |
| **Radix UI**        | Accessible component primitives |
| **shadcn/ui**       | Beautiful component library     |
| **Redux Toolkit**   | State management                |
| **Zustand**         | Lightweight state management    |
| **React Hook Form** | Form handling                   |
| **Zod**             | Schema validation               |
| **GSAP**            | Advanced animations             |
| **Framer Motion**   | UI animations                   |
| **Swiper**          | Touch slider                    |

### **Backend**

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| **Express.js** | REST API framework               |
| **Hono**       | Lightweight web framework        |
| **Prisma**     | PostgreSQL ORM                   |
| **MongoDB**    | Order database                   |
| **Kafka**      | Event streaming                  |
| **Clerk**      | Authentication & user management |
| **Stripe**     | Payment processing               |
| **Cloudinary** | Image hosting & optimization     |

### **DevOps & Tools**

| Technology     | Purpose                         |
| -------------- | ------------------------------- |
| **TurboRepo**  | Monorepo build system           |
| **pnpm**       | Fast package manager            |
| **Docker**     | Containerization (Kafka)        |
| **TypeScript** | Type safety across all services |

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18
- **pnpm** >= 9.0.0
- **Docker** (for Kafka)
- **PostgreSQL** database
- **MongoDB** database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abdulloh-dev03/E-commerrce.git
   cd E-commerce
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in each service directory. See [Environment Variables](#-environment-variables) section.

4. **Start Kafka (Docker)**

   ```bash
   cd packages/kafka
   docker-compose up -d
   ```

5. **Generate Prisma Client**

   ```bash
   cd packages/database
   pnpm db:generate
   ```

6. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

7. **Start all services**
   ```bash
   pnpm dev
   ```

### Access the Applications

- **Client App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Auth Service**: http://localhost:4000
- **Product Service**: http://localhost:4001
- **Payment Service**: http://localhost:4002
- **Order Service**: http://localhost:4003
- **Email Service**: http://localhost:4004

---

## 🔐 Environment Variables

### Client App (`apps/client/.env`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:4001
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:4002
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:4003

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Admin App (`apps/admin/.env`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:4001
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Database Package (`packages/database/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
```

### Order Database (`packages/order-db/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/orders
```

### Payment Service (`apps/payment-service/.env`)

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Kafka Configuration

```env
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=ecommerce-app
```

---

## 📦 Available Scripts

### Root Level

```bash
pnpm dev              # Start all services in development mode
pnpm build            # Build all applications
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier
pnpm check-types      # Type-check all packages
```

### Individual Services

```bash
# Client
cd apps/client
pnpm dev              # Start client on port 3000
pnpm build            # Build for production

# Admin
cd apps/admin
pnpm dev              # Start admin on port 3001
pnpm build            # Build for production

# Database
cd packages/database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:deploy        # Deploy migrations to production
```

---

## 🌐 Live Deployment

### Deployment Platforms

This project can be deployed on:

- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend Services**: Railway, Render, AWS ECS, or DigitalOcean
- **Databases**: Neon (PostgreSQL), MongoDB Atlas
- **Kafka**: Confluent Cloud or self-hosted

---

## 📚 Documentation

### Key Features Explained

#### **Microservices Communication**

Services communicate via Kafka for event-driven architecture:

- Order placed → Email notification
- Payment successful → Order status update
- Product created → Stripe product sync

#### **Authentication Flow**

1. User signs up/in via Clerk
2. JWT token issued
3. Token validated by middleware in each service
4. User data synced across services

#### **Payment Processing**

1. User adds items to cart
2. Checkout creates Stripe session
3. Payment processed via Stripe
4. Webhook confirms payment
5. Order created in database
6. Email confirmation sent

---

## 🎨 UI Components

The project uses a custom component library built on:

- **Radix UI** - Accessible primitives
- **Tailwind CSS v4** - Utility classes
- **CVA** - Component variants
- **Lucide React** - Icon library

Example components:

- `Button`, `Input`, `Select`, `Dialog`
- `DropdownMenu`, `Popover`, `Tabs`
- `NavigationMenu`, `Toast`, `Badge`

---

## 🔄 Database Schema

### PostgreSQL (Products & Categories)

```prisma
model Product {
  id               Int      @id @default(autoincrement())
  name             String
  description      String
  price            Int
  categorySlug     String
  category         Category @relation(fields: [categorySlug], references: [slug])
  variants         Variant[]
  stripeProductId  String?  @unique
  stripePriceId    String?
}

model Category {
  id         Int       @id @default(autoincrement())
  name       String
  slug       String    @unique
  attributes Json
  products   Product[]
}
```

### MongoDB (Orders)

```typescript
{
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}
```

---

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abdulloh**

- GitHub: [@Abdulloh-dev03](https://github.com/Abdulloh-dev03)
- Project Repository: [E-commerce](https://github.com/Abdulloh-dev03/E-commerrce)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Prisma](https://www.prisma.io/) - Database ORM
- [TurboRepo](https://turbo.build/) - Monorepo tooling
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [shadcn/ui](https://ui.shadcn.com/) - Component library

---

## 📞 Support

If you have any questions or need help, please:

- Open an [issue](https://github.com/Abdulloh-dev03/E-commerrce/issues)
- Contact via email (add your email here)
- Join our Discord community (add link if available)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Abdulloh](https://github.com/Abdulloh-dev03)

</div>
