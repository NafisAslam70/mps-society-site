import { pgTable, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  snippetEn: text("snippetEn").notNull(),
  snippetAr: text("snippetAr").notNull(),
  images: jsonb("images").notNull().default([]),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const websiteContent = pgTable("website_content", {
  id: varchar("id", { length: 255 }).primaryKey().default("singleton"),
  type: varchar("type", { length: 50 }).notNull().default("main"),
  data: jsonb("data").notNull().default({
    hero: { images: [], logo: null },
    about: { image: null },
    education: {
      academics: { images: [] },
      islamicEducation: { images: [] },
      sports: { images: [] },
      hostel: { images: [] },
      others: { images: [] },
    },
    video: { videos: [] },
  }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});