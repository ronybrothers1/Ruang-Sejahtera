CREATE TABLE IF NOT EXISTS "programs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "short_description" text NOT NULL,
  "description" text,
  "icon_key" text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "sort_order" integer NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "programs_slug_unique" UNIQUE("slug"),
  CONSTRAINT "programs_sort_order_nonnegative" CHECK ("programs"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "programs_active_order_idx" ON "programs" USING btree ("is_active", "sort_order");
--> statement-breakpoint
INSERT INTO "programs" ("slug", "name", "short_description", "description", "icon_key", "is_active", "sort_order") VALUES
  ('berbagi-rasa', 'Berbagi Rasa', 'Bantuan sembako untuk keluarga yang membutuhkan.', 'Program bantuan kebutuhan pangan dan sembako berdasarkan hasil verifikasi kebutuhan penerima.', 'package-heart', true, 10),
  ('rehat', 'REHAT', 'Renovasi Rumah Rakyat untuk membantu hunian yang lebih layak.', 'Program renovasi rumah bagi penerima yang membutuhkan perbaikan hunian berdasarkan hasil verifikasi lapangan.', 'house-heart', true, 20),
  ('berbagi-air-bersih', 'Berbagi Air Bersih', 'Bantuan akses air bersih bagi masyarakat yang membutuhkan.', 'droplets', true, 30),
  ('berbagi-masa-depan', 'Berbagi Masa Depan', 'Bantuan pendidikan untuk mendukung keberlanjutan belajar.', 'graduation-cap', true, 40),
  ('bantuan-kesehatan', 'Bantuan Kesehatan', 'Bantuan kebutuhan kesehatan bagi penerima yang membutuhkan dukungan.', 'heart-pulse', true, 50)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "short_description" = EXCLUDED."short_description",
  "description" = EXCLUDED."description",
  "icon_key" = EXCLUDED."icon_key",
  "is_active" = EXCLUDED."is_active",
  "sort_order" = EXCLUDED."sort_order",
  "updated_at" = now();
