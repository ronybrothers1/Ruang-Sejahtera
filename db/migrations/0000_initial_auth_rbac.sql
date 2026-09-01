CREATE TYPE "public"."member_card_status" AS ENUM('active', 'revoked', 'expired');--> statement-breakpoint
CREATE TYPE "public"."consent_status" AS ENUM('confirmed', 'restricted', 'not_required', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'pending_review', 'revision_required', 'approved', 'rejected', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('article', 'activity', 'gallery');--> statement-breakpoint
CREATE TYPE "public"."exam_attempt_status" AS ENUM('in_progress', 'submitted', 'graded', 'invalidated');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'document', 'external_video');--> statement-breakpoint
CREATE TYPE "public"."media_visibility" AS ENUM('private', 'restricted', 'public');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('registered', 'email_verified', 'data_review', 'exam_eligible', 'exam_completed', 'passed', 'failed', 'admin_approved', 'active', 'suspended', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'core_manager', 'member');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"actor_role" "user_role" NOT NULL,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"request_id" text,
	"ip_hash" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "content_type" NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"body" text NOT NULL,
	"category" text,
	"owner_id" uuid NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"current_revision" integer DEFAULT 1 NOT NULL,
	"review_requested_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"published_at" timestamp with time zone,
	"published_by" uuid,
	"archived_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_items_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"from_status" "content_status" NOT NULL,
	"to_status" "content_status" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"edited_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"selected_option_id" text NOT NULL,
	"awarded_score" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"settings_id" uuid NOT NULL,
	"attempt_number" integer NOT NULL,
	"status" "exam_attempt_status" DEFAULT 'in_progress' NOT NULL,
	"automatic_score" integer,
	"manual_score" integer,
	"final_score" integer,
	"passed" boolean,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	"graded_at" timestamp with time zone,
	"graded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exam_attempts_attempt_number_positive" CHECK ("exam_attempts"."attempt_number" > 0),
	CONSTRAINT "exam_attempts_automatic_score_range" CHECK ("exam_attempts"."automatic_score" IS NULL OR ("exam_attempts"."automatic_score" BETWEEN 0 AND 100)),
	CONSTRAINT "exam_attempts_manual_score_range" CHECK ("exam_attempts"."manual_score" IS NULL OR ("exam_attempts"."manual_score" BETWEEN 0 AND 100)),
	CONSTRAINT "exam_attempts_final_score_range" CHECK ("exam_attempts"."final_score" IS NULL OR ("exam_attempts"."final_score" BETWEEN 0 AND 100))
);
--> statement-breakpoint
CREATE TABLE "exam_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"settings_id" uuid NOT NULL,
	"dimension" text NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"display_order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exam_questions_display_order_positive" CHECK ("exam_questions"."display_order" > 0)
);
--> statement-breakpoint
CREATE TABLE "exam_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer NOT NULL,
	"passing_score" integer DEFAULT 75 NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"maximum_attempts" integer DEFAULT 2 NOT NULL,
	"retry_delay_days" integer DEFAULT 7 NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exam_settings_version_unique" UNIQUE("version"),
	CONSTRAINT "exam_settings_passing_score_range" CHECK ("exam_settings"."passing_score" BETWEEN 0 AND 100),
	CONSTRAINT "exam_settings_duration_positive" CHECK ("exam_settings"."duration_minutes" > 0),
	CONSTRAINT "exam_settings_maximum_attempts_positive" CHECK ("exam_settings"."maximum_attempts" > 0),
	CONSTRAINT "exam_settings_retry_delay_nonnegative" CHECK ("exam_settings"."retry_delay_days" >= 0)
);
--> statement-breakpoint
CREATE TABLE "financial_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period" text NOT NULL,
	"title" text NOT NULL,
	"total_income" numeric(18, 0) NOT NULL,
	"total_disbursement" numeric(18, 0) NOT NULL,
	"operational_cost" numeric(18, 0),
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_by" uuid NOT NULL,
	"published_at" timestamp with time zone,
	"published_by" uuid,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "financial_reports_total_income_nonnegative" CHECK ("financial_reports"."total_income" >= 0),
	CONSTRAINT "financial_reports_total_disbursement_nonnegative" CHECK ("financial_reports"."total_disbursement" >= 0),
	CONSTRAINT "financial_reports_operational_cost_nonnegative" CHECK ("financial_reports"."operational_cost" IS NULL OR "financial_reports"."operational_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"content_id" uuid,
	"object_key" text,
	"external_url" text,
	"type" "media_type" NOT NULL,
	"mime_type" text,
	"byte_size" integer,
	"width" integer,
	"height" integer,
	"alt_text" text NOT NULL,
	"caption" text,
	"consent_status" "consent_status" DEFAULT 'unknown' NOT NULL,
	"contains_vulnerable_person" boolean DEFAULT false NOT NULL,
	"visibility" "media_visibility" DEFAULT 'private' NOT NULL,
	"malware_scan_status" text DEFAULT 'pending' NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
CREATE TABLE "member_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"member_number" text NOT NULL,
	"verification_token_hash" text NOT NULL,
	"joined_at" date NOT NULL,
	"expires_at" date,
	"status" "member_card_status" DEFAULT 'active' NOT NULL,
	"issued_by" uuid NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoke_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "member_cards_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "member_cards_member_number_unique" UNIQUE("member_number"),
	CONSTRAINT "member_cards_verification_token_hash_unique" UNIQUE("verification_token_hash")
);
--> statement-breakpoint
CREATE TABLE "membership_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"phone" text,
	"birth_place" text,
	"birth_date" date,
	"occupation" text,
	"address" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"motivation" text,
	"emergency_contact" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"requirements_complete" boolean DEFAULT false NOT NULL,
	"privacy_consent_at" timestamp with time zone,
	"documentation_consent_at" timestamp with time zone,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "membership_applications_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_provider_id" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"full_name" text NOT NULL,
	"profile_image_url" text,
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"membership_status" "membership_status" DEFAULT 'registered' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_identity_provider_id_unique" UNIQUE("identity_provider_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_published_by_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_reviews" ADD CONSTRAINT "content_reviews_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_reviews" ADD CONSTRAINT "content_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_edited_by_users_id_fk" FOREIGN KEY ("edited_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_attempt_id_exam_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_question_id_exam_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."exam_questions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_settings_id_exam_settings_id_fk" FOREIGN KEY ("settings_id") REFERENCES "public"."exam_settings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_graded_by_users_id_fk" FOREIGN KEY ("graded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_settings_id_exam_settings_id_fk" FOREIGN KEY ("settings_id") REFERENCES "public"."exam_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_settings" ADD CONSTRAINT "exam_settings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_reports" ADD CONSTRAINT "financial_reports_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_reports" ADD CONSTRAINT "financial_reports_published_by_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_content_id_content_items_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_cards" ADD CONSTRAINT "member_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_cards" ADD CONSTRAINT "member_cards_issued_by_users_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_applications" ADD CONSTRAINT "membership_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_applications" ADD CONSTRAINT "membership_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "content_items_status_published_idx" ON "content_items" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "content_items_owner_status_idx" ON "content_items" USING btree ("owner_id","status");--> statement-breakpoint
CREATE INDEX "content_reviews_content_created_idx" ON "content_reviews" USING btree ("content_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "content_revisions_content_number_idx" ON "content_revisions" USING btree ("content_id","revision_number");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_answers_attempt_question_idx" ON "exam_answers" USING btree ("attempt_id","question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exam_attempts_user_number_idx" ON "exam_attempts" USING btree ("user_id","attempt_number");--> statement-breakpoint
CREATE INDEX "exam_attempts_status_idx" ON "exam_attempts" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE INDEX "exam_questions_settings_order_idx" ON "exam_questions" USING btree ("settings_id","display_order");--> statement-breakpoint
CREATE INDEX "financial_reports_period_status_idx" ON "financial_reports" USING btree ("period","status");--> statement-breakpoint
CREATE INDEX "media_assets_owner_idx" ON "media_assets" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "media_assets_content_idx" ON "media_assets" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "users_role_status_idx" ON "users" USING btree ("role","membership_status");