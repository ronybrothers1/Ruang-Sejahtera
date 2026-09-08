CREATE TYPE "public"."program_application_status" AS ENUM('submitted', 'under_review', 'revision_required', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "program_applications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "applicant_user_id" uuid NOT NULL,
  "program_slug" text NOT NULL,
  "beneficiary_name" text NOT NULL,
  "beneficiary_identity" text NOT NULL,
  "phone" text NOT NULL,
  "address" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "details" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "existing_photo_url" text,
  "existing_photo_alt" text,
  "status" "program_application_status" DEFAULT 'submitted' NOT NULL,
  "reviewed_by" uuid,
  "reviewed_at" timestamp with time zone,
  "review_note" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "program_applications" ADD CONSTRAINT "program_applications_applicant_user_id_users_id_fk" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_applications" ADD CONSTRAINT "program_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "program_applications_status_idx" ON "program_applications" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "program_applications_program_idx" ON "program_applications" USING btree ("program_slug","created_at");--> statement-breakpoint
CREATE INDEX "program_applications_applicant_idx" ON "program_applications" USING btree ("applicant_user_id","created_at");