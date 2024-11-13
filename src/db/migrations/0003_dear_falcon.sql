DROP INDEX IF EXISTS "id_idx";--> statement-breakpoint
ALTER TABLE "booksHistory" ALTER COLUMN "author" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "booksHistory" ADD CONSTRAINT "booksHistory_outdatedFrom_id_pk" PRIMARY KEY("outdatedFrom","id");