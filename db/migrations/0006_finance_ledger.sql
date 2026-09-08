DO $$ BEGIN
  CREATE TYPE "finance_transaction_kind" AS ENUM ('opening_balance', 'income', 'expense');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "finance_transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "transaction_date" date NOT NULL,
  "kind" "finance_transaction_kind" NOT NULL,
  "category" text NOT NULL,
  "description" text NOT NULL,
  "amount" numeric(18, 0) NOT NULL,
  "program_slug" text,
  "reference_number" text,
  "notes" text,
  "created_by" uuid NOT NULL,
  "updated_by" uuid,
  "deleted_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "finance_transactions_amount_positive" CHECK ("finance_transactions"."amount" > 0),
  CONSTRAINT "finance_transactions_category_length" CHECK (char_length("finance_transactions"."category") BETWEEN 1 AND 120),
  CONSTRAINT "finance_transactions_description_length" CHECK (char_length("finance_transactions"."description") BETWEEN 1 AND 500),
  CONSTRAINT "finance_transactions_reference_length" CHECK ("finance_transactions"."reference_number" IS NULL OR char_length("finance_transactions"."reference_number") <= 120),
  CONSTRAINT "finance_transactions_notes_length" CHECK ("finance_transactions"."notes" IS NULL OR char_length("finance_transactions"."notes") <= 1000),
  CONSTRAINT "finance_transactions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action,
  CONSTRAINT "finance_transactions_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "finance_transactions_date_idx" ON "finance_transactions" USING btree ("transaction_date", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "finance_transactions_kind_date_idx" ON "finance_transactions" USING btree ("kind", "transaction_date");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "finance_transactions_program_date_idx" ON "finance_transactions" USING btree ("program_slug", "transaction_date");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "finance_transactions_single_opening_balance_idx" ON "finance_transactions" USING btree ("kind") WHERE "kind" = 'opening_balance' AND "deleted_at" IS NULL;
