CREATE TYPE "public"."orderStatus" AS ENUM('CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PENDING', 'FAILED', 'REFUNDED', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."authType" AS ENUM('GOOGLE', 'CREDENTIALS');--> statement-breakpoint
CREATE TYPE "public"."userRole" AS ENUM('ADMIN', 'CLIENT');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"model" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"price" numeric NOT NULL,
	"quantity" integer DEFAULT 0,
	"categoryId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "device_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar(255) NOT NULL,
	"deviceId" uuid,
	"isPrimary" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order-items" (
	"orderId" uuid NOT NULL,
	"deviceId" uuid NOT NULL,
	"quantity" integer DEFAULT 0,
	"addedAt" timestamp DEFAULT now(),
	CONSTRAINT "order-items_orderId_deviceId_pk" PRIMARY KEY("orderId","deviceId")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clientId" uuid NOT NULL,
	"wishlistId" uuid,
	"createdAt" timestamp DEFAULT now(),
	"status" "orderStatus" DEFAULT 'CREATED' NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"clientId" uuid NOT NULL,
	"provider" varchar(50) DEFAULT 'STRIPE',
	"providerPaymentId" varchar(255),
	"currency" varchar(10) DEFAULT 'usd',
	"amount" integer DEFAULT 0 NOT NULL,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "payments_providerPaymentId_unique" UNIQUE("providerPaymentId")
);
--> statement-breakpoint
CREATE TABLE "wishlist-items" (
	"wishlistId" uuid NOT NULL,
	"deviceId" uuid NOT NULL,
	"quantity" integer DEFAULT 0,
	"addedAt" timestamp DEFAULT now(),
	CONSTRAINT "wishlist-items_wishlistId_deviceId_pk" PRIMARY KEY("wishlistId","deviceId")
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clientId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "userRole" DEFAULT 'CLIENT' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "authType" "authType" DEFAULT 'CREDENTIALS' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_images" ADD CONSTRAINT "device_images_deviceId_devices_id_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_deviceId_devices_id_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_wishlistId_wishlist_id_fk" FOREIGN KEY ("wishlistId") REFERENCES "public"."wishlist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_clientId_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist-items" ADD CONSTRAINT "wishlist-items_wishlistId_wishlist_id_fk" FOREIGN KEY ("wishlistId") REFERENCES "public"."wishlist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist-items" ADD CONSTRAINT "wishlist-items_deviceId_devices_id_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_clientId_users_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categoryNameIndex" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "nameIndex" ON "devices" USING btree ("name");--> statement-breakpoint
CREATE INDEX "yearIndex" ON "devices" USING btree ("year");--> statement-breakpoint
CREATE INDEX "orderIndex" ON "order-items" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "orderdeviceIndex" ON "order-items" USING btree ("deviceId");--> statement-breakpoint
CREATE INDEX "wishlistIndex" ON "wishlist-items" USING btree ("wishlistId");--> statement-breakpoint
CREATE INDEX "wishlistdeviceIndex" ON "wishlist-items" USING btree ("deviceId");--> statement-breakpoint
CREATE UNIQUE INDEX "uniqueWishlistPerUser" ON "wishlist" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX "emailIndex" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "usernameIndex" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idIndex" ON "users" USING btree ("id");