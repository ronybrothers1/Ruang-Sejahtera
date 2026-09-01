ALTER TABLE "content_items" ADD COLUMN "activity_date" date;
ALTER TABLE "content_items" ADD COLUMN "location_label" text;
ALTER TABLE "content_items" ADD COLUMN "program_slug" text;
ALTER TABLE "financial_reports" ADD COLUMN "report_date" date;
ALTER TABLE "financial_reports" ADD COLUMN "description" text;
UPDATE "financial_reports" SET "report_date" = CURRENT_DATE WHERE "report_date" IS NULL;
UPDATE "financial_reports" SET "description" = 'Uraian laporan belum diisi pada data lama.' WHERE "description" IS NULL;
ALTER TABLE "financial_reports" ALTER COLUMN "report_date" SET NOT NULL;
ALTER TABLE "financial_reports" ALTER COLUMN "description" SET NOT NULL;
--> statement-breakpoint
CREATE INDEX "content_items_activity_date_idx" ON "content_items" USING btree ("activity_date");
