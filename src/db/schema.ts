import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  pgEnum,
  timestamp,
  unique,
  jsonb,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("role", ["USER", "ADMIN", "COURIER"]);
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    age: integer("age").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    role: userRole("role").notNull().default("USER"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  //ბაზაშ უნიკაურია ეს მეილი და აღარ გამეროდეს
  (t) => [unique("users_email_unique").on(t.email)]
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("refresh_token_value_idx").on(t.token),
    unique("refresh_token_user_idx").on(t.userId, t.token),
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: jsonb("name").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("categories_slug_unique").on(t.slug),
    index("categories_parent_idx").on(t.parentId),
  ]
);