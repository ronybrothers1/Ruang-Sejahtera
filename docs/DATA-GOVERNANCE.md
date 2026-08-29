# Data Governance V2

## Source of truth
Public pages must read only records that have passed the configured publication workflow. CMS drafts, private media, payment events, donor PII, and internal audit logs are never public data sources.

## Impact data
Every published metric requires:
- metric definition;
- reporting period;
- source reference;
- methodology note;
- program scope where relevant;
- deduplication rule where beneficiaries can appear in multiple activities.

## Financial data
Payment events are not automatically financial-report truth. A donation moves from gateway event to transaction record, reconciliation, allocation, and only then to reporting. Published reports must be immutable by ordinary content editors.

## Personal data
Donor data and beneficiary data have different publication purposes. Donor PII is private by default. Beneficiary documentation must carry consent/restriction metadata, particularly where children or vulnerable persons are involved.

## Retention
A production data-retention schedule must define retention and deletion/anonymization periods for inquiries, donor records, payment logs, media consent evidence, and audit logs according to legal and operational requirements.
