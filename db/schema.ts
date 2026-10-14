import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const projectStatusValues = ["draft", "published"] as const;

export type GalleryImage = {
  url: string;
  path: string;
};

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  description: text("description"),
  techTags: text("tech_tags").array().notNull().default([]),
  coverImageUrl: text("cover_image_url"),
  coverImagePath: text("cover_image_path"),
  gallery: jsonb("gallery").$type<GalleryImage[]>().notNull().default([]),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  status: text("status", { enum: projectStatusValues })
    .notNull()
    .default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Project = typeof projects.$inferSelect;
