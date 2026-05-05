DROP TABLE "site_content" CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_new" boolean DEFAULT false;