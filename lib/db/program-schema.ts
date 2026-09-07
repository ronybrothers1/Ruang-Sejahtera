import { boolean, check, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const programs = pgTable('programs', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortDescription: text('short_description').notNull(),
  description: text('description'),
  iconKey: text('icon_key').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('programs_active_order_idx').on(table.isActive, table.sortOrder),
  check('programs_sort_order_nonnegative', sql`${table.sortOrder} >= 0`),
]);

export type ProgramRow = typeof programs.$inferSelect;
