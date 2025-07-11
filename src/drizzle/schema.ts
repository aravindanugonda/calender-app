import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  auth0Id: text("auth0_id").unique().notNull(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false),
  color: text("color").default("#3B82F6"),
  position: integer("position").default(0),
  parentTaskId: text("parent_task_id"),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurringPattern: text("recurring_pattern"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
export const taskCompletions = sqliteTable("task_completions", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  completionDate: text("completion_date").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
