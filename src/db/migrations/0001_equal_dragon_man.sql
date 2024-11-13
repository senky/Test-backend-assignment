CREATE TABLE IF NOT EXISTS "booksHistory" (
	"outdatedFrom" date DEFAULT now() NOT NULL,
	"id" integer NOT NULL,
	"title" varchar NOT NULL,
	"author" integer,
	"publishedYear" integer NOT NULL,
	"genres" "genre"[] NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booksHistory" ADD CONSTRAINT "booksHistory_author_authors_id_fk" FOREIGN KEY ("author") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_idx" ON "booksHistory" USING btree ("id");