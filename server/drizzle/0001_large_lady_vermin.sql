CREATE TYPE "public"."accountStatus" AS ENUM('PENDING', 'VERIFIED');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET');--> statement-breakpoint
CREATE TABLE "verify_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"type" "type" DEFAULT 'EMAIL_VERIFICATION' NOT NULL,
	"expiresAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "verify_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "accountStatus" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "verify_token" ADD CONSTRAINT "verify_token_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;