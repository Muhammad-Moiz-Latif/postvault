CREATE TYPE "public"."postStatus" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
CREATE TYPE "public"."authType" AS ENUM('GOOGLE', 'CREDENTIALS');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"authorId" uuid NOT NULL,
	"postId" uuid NOT NULL,
	"parentId" uuid,
	"text" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "likecomment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"authorId" uuid NOT NULL,
	"commentId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "likepost" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"authorId" uuid NOT NULL,
	"postId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"authorId" uuid,
	"title" varchar(255) NOT NULL,
	"img" varchar DEFAULT '',
	"paragraph" text NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"status" "postStatus" DEFAULT 'DRAFT' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"publishedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" varchar(255),
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"img" varchar DEFAULT '',
	"authType" "authType" DEFAULT 'CREDENTIALS' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_comments_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likecomment" ADD CONSTRAINT "likecomment_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likecomment" ADD CONSTRAINT "likecomment_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likepost" ADD CONSTRAINT "likepost_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likepost" ADD CONSTRAINT "likepost_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comment_idx" ON "comments" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_comment" ON "likecomment" USING btree ("authorId","commentId");--> statement-breakpoint
CREATE INDEX "like_comment_idx" ON "likecomment" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_post" ON "likepost" USING btree ("authorId","postId");--> statement-breakpoint
CREATE INDEX "like_post_idx" ON "likepost" USING btree ("id");--> statement-breakpoint
CREATE INDEX "post_title_idx" ON "posts" USING btree ("title");--> statement-breakpoint
CREATE INDEX "post_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "post_author_idx" ON "posts" USING btree ("authorId");--> statement-breakpoint
CREATE INDEX "post_created_idx" ON "posts" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "username_idx" ON "users" USING btree ("username");