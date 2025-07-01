import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  timestamp, 
  boolean, 
  decimal,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  phoneNumber: text("phone_number"),
  location: text("location"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pet product categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  parentId: integer("parent_id"),
});

// Pet product listings
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: integer("category_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  location: text("location").notNull(),
  condition: text("condition"), // "new", "like_new", "good", "fair"
  status: text("status").default("active"), // "active", "sold", "reserved"
  images: text("images").array(),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency hospitals
export const emergencyHospitals = pgTable("emergency_hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  location: text("location").notNull(),
  is24Hours: boolean("is_24_hours").default(false),
  status: text("status").default("available"), // "available", "busy", "closed"
  rating: decimal("rating", { precision: 3, scale: 2 }),
  distance: decimal("distance", { precision: 5, scale: 2 }), // in km
  services: text("services").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pet services (grooming, training, etc.)
export const petServices = pgTable("pet_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "grooming", "training", "veterinary", "boarding"
  description: text("description"),
  address: text("address").notNull(),
  phoneNumber: text("phone_number"),
  location: text("location").notNull(),
  priceRange: text("price_range"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  images: text("images").array(),
  services: text("services").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community posts
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // "lost", "found", "adoption", "gathering", "general"
  authorId: integer("author_id").notNull(),
  location: text("location"),
  images: text("images").array(),
  status: text("status").default("active"), // "active", "resolved", "closed"
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency bookings
export const emergencyBookings = pgTable("emergency_bookings", {
  id: serial("id").primaryKey(),
  petOwnerName: text("pet_owner_name").notNull(),
  petOwnerPhone: text("pet_owner_phone").notNull(),
  petName: text("pet_name").notNull(),
  petType: text("pet_type").notNull(),
  emergencyType: text("emergency_type").notNull(),
  description: text("description"),
  pickupLocation: text("pickup_location").notNull(),
  hospitalId: integer("hospital_id"),
  status: text("status").default("pending"), // "pending", "confirmed", "in_progress", "completed", "cancelled"
  urgencyLevel: text("urgency_level").default("medium"), // "low", "medium", "high", "critical"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  communityPosts: many(communityPosts),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  listings: many(listings),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
}));

export const listingsRelations = relations(listings, ({ one }) => ({
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one }) => ({
  author: one(users, {
    fields: [communityPosts.authorId],
    references: [users.id],
  }),
}));

export const emergencyBookingsRelations = relations(emergencyBookings, ({ one }) => ({
  hospital: one(emergencyHospitals, {
    fields: [emergencyBookings.hospitalId],
    references: [emergencyHospitals.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
});

export const insertEmergencyHospitalSchema = createInsertSchema(emergencyHospitals).omit({
  id: true,
  createdAt: true,
});

export const insertPetServiceSchema = createInsertSchema(petServices).omit({
  id: true,
  createdAt: true,
  reviewCount: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likeCount: true,
  commentCount: true,
});

export const insertEmergencyBookingSchema = createInsertSchema(emergencyBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type EmergencyHospital = typeof emergencyHospitals.$inferSelect;
export type InsertEmergencyHospital = z.infer<typeof insertEmergencyHospitalSchema>;

export type PetService = typeof petServices.$inferSelect;
export type InsertPetService = z.infer<typeof insertPetServiceSchema>;

export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;

export type EmergencyBooking = typeof emergencyBookings.$inferSelect;
export type InsertEmergencyBooking = z.infer<typeof insertEmergencyBookingSchema>;
