-- Reference PostgreSQL schema for Ruang Sejahtera V2.
-- Do not apply to production before infrastructure/security review.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('super_admin','content_admin','finance','editor')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  summary text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  activity_date date NOT NULL,
  location_label text NOT NULL,
  beneficiary_count integer CHECK (beneficiary_count IS NULL OR beneficiary_count >= 0),
  funding_source text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX activities_program_date_idx ON activities(program_id, activity_date DESC);

CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,
  category text NOT NULL,
  author_user_id uuid REFERENCES users(id),
  published_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX articles_status_published_idx ON articles(status, published_at DESC);

CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE SET NULL,
  object_key text NOT NULL UNIQUE,
  media_type text NOT NULL CHECK (media_type IN ('image','video','document')),
  alt_text text NOT NULL,
  caption text,
  consent_status text NOT NULL DEFAULT 'unknown' CHECK (consent_status IN ('confirmed','restricted','not_required','unknown')),
  contains_vulnerable_person boolean NOT NULL DEFAULT false,
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private','restricted','public')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX media_activity_idx ON media(activity_id);

CREATE TABLE donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  display_preference text NOT NULL DEFAULT 'anonymous' CHECK (display_preference IN ('named','anonymous')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(id) ON DELETE SET NULL,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  amount bigint NOT NULL CHECK (amount > 0),
  currency char(3) NOT NULL DEFAULT 'IDR' CHECK (currency = 'IDR'),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','expired','refunded')),
  gateway_provider text,
  gateway_reference text UNIQUE,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX donations_status_created_idx ON donations(payment_status, created_at DESC);
CREATE INDEX donations_program_idx ON donations(program_id);

CREATE TABLE donation_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES donations(id),
  program_id uuid NOT NULL REFERENCES programs(id),
  amount bigint NOT NULL CHECK (amount > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (donation_id, program_id)
);

CREATE TABLE financial_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  total_income bigint NOT NULL CHECK (total_income >= 0),
  total_disbursement bigint NOT NULL CHECK (total_disbursement >= 0),
  operational_cost bigint CHECK (operational_cost IS NULL OR operational_cost >= 0),
  publication_status text NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft','review','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX financial_reports_period_idx ON financial_reports(period, program_id);

CREATE TABLE public_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES financial_reports(id) ON DELETE SET NULL,
  title text NOT NULL,
  document_type text NOT NULL,
  period text,
  object_key text NOT NULL UNIQUE,
  publication_status text NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft','review','published','archived')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE impact_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text NOT NULL,
  period text NOT NULL,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  methodology_note text NOT NULL,
  source_reference text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (metric_key, period, program_id)
);

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text NOT NULL,
  responsibility text,
  photo_media_id uuid REFERENCES media(id) ON DELETE SET NULL,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  actor_role text NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_resource_idx ON audit_logs(resource_type, resource_id, created_at DESC);
CREATE INDEX audit_logs_actor_idx ON audit_logs(actor_user_id, created_at DESC);

-- Production implementation must add an application-owned updated_at trigger,
-- encryption/KMS strategy for donor PII, backup policy, and least-privilege DB roles.
