CREATE TABLE "admin_login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key_hash" text NOT NULL,
	"failures" integer DEFAULT 0 NOT NULL,
	"window_started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"blocked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_login_attempts_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD COLUMN "question_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "program_applications" ADD COLUMN "existing_photo_media_id" uuid;--> statement-breakpoint
ALTER TABLE "program_applications" ADD CONSTRAINT "program_applications_existing_photo_media_id_media_assets_id_fk" FOREIGN KEY ("existing_photo_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_login_attempts_blocked_idx" ON "admin_login_attempts" USING btree ("blocked_until");--> statement-breakpoint
CREATE UNIQUE INDEX "program_applications_active_applicant_program_idx" ON "program_applications" USING btree ("applicant_user_id","program_slug") WHERE "program_applications"."deleted_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "exam_attempts_one_active_user_idx" ON "exam_attempts" USING btree ("user_id") WHERE "exam_attempts"."status" = 'in_progress';
