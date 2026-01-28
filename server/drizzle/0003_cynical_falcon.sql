ALTER TYPE "public"."authType" ADD VALUE 'BOTH';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;