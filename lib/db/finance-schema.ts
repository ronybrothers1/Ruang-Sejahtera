import { check, date, index, numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/schema';

export const financeTransactionKindEnum = pgEnum('finance_transaction_kind', [
  'opening_balance',
  'income',
  'expense',
]);

export const financeTransactions = pgTable('finance_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  transactionDate: date('transaction_date').notNull(),
  kind: financeTransactionKindEnum('kind').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 18, scale: 0 }).notNull(),
  programSlug: text('program_slug'),
  referenceNumber: text('reference_number'),
  notes: text('notes'),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('finance_transactions_date_idx').on(table.transactionDate, table.createdAt),
  index('finance_transactions_kind_date_idx').on(table.kind, table.transactionDate),
  index('finance_transactions_program_date_idx').on(table.programSlug, table.transactionDate),
  uniqueIndex('finance_transactions_single_opening_balance_idx')
    .on(table.kind)
    .where(sql`${table.kind} = 'opening_balance' AND ${table.deletedAt} IS NULL`),
  check('finance_transactions_amount_positive', sql`${table.amount} > 0`),
  check('finance_transactions_category_length', sql`char_length(${table.category}) BETWEEN 1 AND 120`),
  check('finance_transactions_description_length', sql`char_length(${table.description}) BETWEEN 1 AND 500`),
  check('finance_transactions_reference_length', sql`${table.referenceNumber} IS NULL OR char_length(${table.referenceNumber}) <= 120`),
  check('finance_transactions_notes_length', sql`${table.notes} IS NULL OR char_length(${table.notes}) <= 1000`),
]);

export type FinanceTransactionRow = typeof financeTransactions.$inferSelect;
