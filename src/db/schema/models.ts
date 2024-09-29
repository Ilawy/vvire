import {
  text,
  integer,
  sqliteTable,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { OutputData } from "@editorjs/editorjs";
//TODO add (archive + pointer) for stale articles to be stored in a json file and fetched on demand
export const articles = sqliteTable(
  "articles",
  {
    id: integer("id").unique().notNull().primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),

    public: integer("public", { mode: "boolean" }).notNull().default(true),
    // prettier-ignore
    role: text("role", {enum: ["author", "sudo"]}).notNull().default("author"),

    content: text("content", {
      mode: "json",
    })
      .notNull()
      .$type<OutputData["blocks"]>(),
    editor_time: integer("editor_time").notNull(),
    added_at: integer("added_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    added_by: text("added_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (article) => ({
    article_slug_duplicate: uniqueIndex("article_slug_duplicate").on(
      article.slug
    ),
  })
);

export const Article = createInsertSchema(articles);
export type Article = z.infer<typeof Article>;

export const redirects = sqliteTable(
  "redirects",
  {
    id: integer("id").unique().notNull().primaryKey(),
    source: text("source").notNull(),
    dest: text("dest").notNull(),
    added_at: integer("added_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    added_by: text("added_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    redirects_source_duplicate: uniqueIndex("redirects_source_duplicate").on(
      t.source
    ),
    redirects_dest_duplicate: uniqueIndex("redirects_dest_duplicate").on(
      t.dest
    ),
  })
);

export const Redirect = createInsertSchema(redirects);
export type Redirect = z.infer<typeof Redirect>;
