ALTER TABLE "users" RENAME COLUMN "255" TO "username";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_255_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "img" varchar DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");