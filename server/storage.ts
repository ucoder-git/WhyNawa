import {
  users,
  listings,
  categories,
  emergencyHospitals,
  petServices,
  communityPosts,
  emergencyBookings,
  serviceInquiries,
  adminUsers,
  type User,
  type InsertUser,
  type Listing,
  type InsertListing,
  type Category,
  type EmergencyHospital,
  type InsertEmergencyHospital,
  type PetService,
  type InsertPetService,
  type CommunityPost,
  type InsertCommunityPost,
  type EmergencyBooking,
  type InsertEmergencyBooking,
  type ServiceInquiry,
  type InsertServiceInquiry,
  type AdminUser,
  type InsertAdminUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(name: string, icon: string, parentId?: number): Promise<Category>;

  // Listing operations
  getListings(location?: string, categoryId?: number, searchTerm?: string): Promise<(Listing & { seller: User; category: Category })[]>;
  getListingById(id: number): Promise<(Listing & { seller: User; category: Category }) | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: number, updates: Partial<InsertListing>): Promise<Listing | undefined>;
  incrementViewCount(id: number): Promise<void>;
  toggleListingLike(listingId: number, userId: number): Promise<void>;

  // Emergency hospital operations
  getEmergencyHospitals(location?: string): Promise<EmergencyHospital[]>;
  getEmergencyHospitalById(id: number): Promise<EmergencyHospital | undefined>;
  createEmergencyHospital(hospital: InsertEmergencyHospital): Promise<EmergencyHospital>;

  // Pet service operations
  getPetServices(location?: string, type?: string): Promise<PetService[]>;
  getPetServiceById(id: number): Promise<PetService | undefined>;
  createPetService(service: InsertPetService): Promise<PetService>;

  // Community post operations
  getCommunityPosts(location?: string, type?: string): Promise<(CommunityPost & { author: User })[]>;
  getCommunityPostById(id: number): Promise<(CommunityPost & { author: User }) | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: number, updates: Partial<InsertCommunityPost>): Promise<CommunityPost | undefined>;

  // Emergency booking operations
  getEmergencyBookings(): Promise<(EmergencyBooking & { hospital?: EmergencyHospital })[]>;
  getEmergencyBookingById(id: number): Promise<(EmergencyBooking & { hospital?: EmergencyHospital }) | undefined>;
  createEmergencyBooking(booking: InsertEmergencyBooking): Promise<EmergencyBooking>;
  updateEmergencyBooking(id: number, updates: Partial<InsertEmergencyBooking>): Promise<EmergencyBooking | undefined>;

  // Service inquiry operations
  getServiceInquiries(status?: string): Promise<ServiceInquiry[]>;
  getServiceInquiryById(id: number): Promise<ServiceInquiry | undefined>;
  createServiceInquiry(inquiry: InsertServiceInquiry): Promise<ServiceInquiry>;
  updateServiceInquiry(id: number, updates: Partial<ServiceInquiry>): Promise<ServiceInquiry | undefined>;

  // Admin operations
  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;
  updateEmergencyHospital(id: number, updates: Partial<InsertEmergencyHospital>): Promise<EmergencyHospital | undefined>;
  updatePetService(id: number, updates: Partial<InsertPetService>): Promise<PetService | undefined>;
  deleteEmergencyHospital(id: number): Promise<void>;
  deletePetService(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(name: string, icon: string, parentId?: number): Promise<Category> {
    const [category] = await db.insert(categories)
      .values({ name, icon, parentId })
      .returning();
    return category;
  }

  // Listing operations
  async getListings(location?: string, categoryId?: number, searchTerm?: string): Promise<(Listing & { seller: User; category: Category })[]> {
    let query = db
      .select()
      .from(listings)
      .leftJoin(users, eq(listings.sellerId, users.id))
      .leftJoin(categories, eq(listings.categoryId, categories.id))
      .where(eq(listings.status, 'active'));

    const conditions = [eq(listings.status, 'active')];
    
    if (location) {
      conditions.push(like(listings.location, `%${location}%`));
    }
    
    if (categoryId) {
      conditions.push(eq(listings.categoryId, categoryId));
    }
    
    if (searchTerm) {
      conditions.push(
        sql`(${listings.title} ILIKE ${'%' + searchTerm + '%'} OR ${listings.description} ILIKE ${'%' + searchTerm + '%'})`
      );
    }

    const results = await db
      .select()
      .from(listings)
      .leftJoin(users, eq(listings.sellerId, users.id))
      .leftJoin(categories, eq(listings.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(listings.createdAt));

    return results.map(result => ({
      ...result.listings,
      seller: result.users!,
      category: result.categories!,
    }));
  }

  async getListingById(id: number): Promise<(Listing & { seller: User; category: Category }) | undefined> {
    const [result] = await db
      .select()
      .from(listings)
      .leftJoin(users, eq(listings.sellerId, users.id))
      .leftJoin(categories, eq(listings.categoryId, categories.id))
      .where(eq(listings.id, id));

    if (!result) return undefined;

    return {
      ...result.listings,
      seller: result.users!,
      category: result.categories!,
    };
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const [newListing] = await db.insert(listings).values(listing).returning();
    return newListing;
  }

  async updateListing(id: number, updates: Partial<InsertListing>): Promise<Listing | undefined> {
    const [updated] = await db
      .update(listings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();
    return updated || undefined;
  }

  async incrementViewCount(id: number): Promise<void> {
    await db
      .update(listings)
      .set({ viewCount: sql`${listings.viewCount} + 1` })
      .where(eq(listings.id, id));
  }

  async toggleListingLike(listingId: number, userId: number): Promise<void> {
    // This is a simplified implementation - in real app you'd have a separate likes table
    await db
      .update(listings)
      .set({ likeCount: sql`${listings.likeCount} + 1` })
      .where(eq(listings.id, listingId));
  }

  // Emergency hospital operations
  async getEmergencyHospitals(location?: string): Promise<EmergencyHospital[]> {
    let query = db.select().from(emergencyHospitals);
    
    if (location) {
      query = query.where(like(emergencyHospitals.location, `%${location}%`));
    }
    
    return await query.orderBy(asc(emergencyHospitals.distance));
  }

  async getEmergencyHospitalById(id: number): Promise<EmergencyHospital | undefined> {
    const [hospital] = await db.select().from(emergencyHospitals).where(eq(emergencyHospitals.id, id));
    return hospital || undefined;
  }

  async createEmergencyHospital(hospital: InsertEmergencyHospital): Promise<EmergencyHospital> {
    const [newHospital] = await db.insert(emergencyHospitals).values(hospital).returning();
    return newHospital;
  }

  // Pet service operations
  async getPetServices(location?: string, type?: string): Promise<PetService[]> {
    const conditions = [];
    
    if (location) {
      conditions.push(like(petServices.location, `%${location}%`));
    }
    
    if (type) {
      conditions.push(eq(petServices.type, type));
    }

    let query = db.select().from(petServices);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(petServices.rating));
  }

  async getPetServiceById(id: number): Promise<PetService | undefined> {
    const [service] = await db.select().from(petServices).where(eq(petServices.id, id));
    return service || undefined;
  }

  async createPetService(service: InsertPetService): Promise<PetService> {
    const [newService] = await db.insert(petServices).values(service).returning();
    return newService;
  }

  // Community post operations
  async getCommunityPosts(location?: string, type?: string): Promise<(CommunityPost & { author: User })[]> {
    const conditions = [eq(communityPosts.status, 'active')];
    
    if (location) {
      conditions.push(like(communityPosts.location, `%${location}%`));
    }
    
    if (type) {
      conditions.push(eq(communityPosts.type, type));
    }

    const results = await db
      .select()
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.authorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(communityPosts.createdAt));

    return results.map(result => ({
      ...result.community_posts,
      author: result.users!,
    }));
  }

  async getCommunityPostById(id: number): Promise<(CommunityPost & { author: User }) | undefined> {
    const [result] = await db
      .select()
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.authorId, users.id))
      .where(eq(communityPosts.id, id));

    if (!result) return undefined;

    return {
      ...result.community_posts,
      author: result.users!,
    };
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db.insert(communityPosts).values(post).returning();
    return newPost;
  }

  async updateCommunityPost(id: number, updates: Partial<InsertCommunityPost>): Promise<CommunityPost | undefined> {
    const [updated] = await db
      .update(communityPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(communityPosts.id, id))
      .returning();
    return updated || undefined;
  }

  // Emergency booking operations
  async getEmergencyBookings(): Promise<(EmergencyBooking & { hospital?: EmergencyHospital })[]> {
    const results = await db
      .select()
      .from(emergencyBookings)
      .leftJoin(emergencyHospitals, eq(emergencyBookings.hospitalId, emergencyHospitals.id))
      .orderBy(desc(emergencyBookings.createdAt));

    return results.map(result => ({
      ...result.emergency_bookings,
      hospital: result.emergency_hospitals || undefined,
    }));
  }

  async getEmergencyBookingById(id: number): Promise<(EmergencyBooking & { hospital?: EmergencyHospital }) | undefined> {
    const [result] = await db
      .select()
      .from(emergencyBookings)
      .leftJoin(emergencyHospitals, eq(emergencyBookings.hospitalId, emergencyHospitals.id))
      .where(eq(emergencyBookings.id, id));

    if (!result) return undefined;

    return {
      ...result.emergency_bookings,
      hospital: result.emergency_hospitals || undefined,
    };
  }

  async createEmergencyBooking(booking: InsertEmergencyBooking): Promise<EmergencyBooking> {
    const [newBooking] = await db.insert(emergencyBookings).values(booking).returning();
    return newBooking;
  }

  async updateEmergencyBooking(id: number, updates: Partial<InsertEmergencyBooking>): Promise<EmergencyBooking | undefined> {
    const [updated] = await db
      .update(emergencyBookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emergencyBookings.id, id))
      .returning();
    return updated || undefined;
  }

  // Service inquiry operations
  async getServiceInquiries(status?: string): Promise<ServiceInquiry[]> {
    let query = db.select().from(serviceInquiries);
    
    if (status) {
      query = query.where(eq(serviceInquiries.status, status));
    }
    
    return await query.orderBy(desc(serviceInquiries.createdAt));
  }

  async getServiceInquiryById(id: number): Promise<ServiceInquiry | undefined> {
    const [inquiry] = await db.select().from(serviceInquiries).where(eq(serviceInquiries.id, id));
    return inquiry || undefined;
  }

  async createServiceInquiry(inquiry: InsertServiceInquiry): Promise<ServiceInquiry> {
    const [newInquiry] = await db.insert(serviceInquiries).values(inquiry).returning();
    return newInquiry;
  }

  async updateServiceInquiry(id: number, updates: Partial<ServiceInquiry>): Promise<ServiceInquiry | undefined> {
    const [updated] = await db
      .update(serviceInquiries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(serviceInquiries.id, id))
      .returning();
    return updated || undefined;
  }

  // Admin operations
  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers).where(eq(adminUsers.isActive, true));
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return admin || undefined;
  }

  async createAdminUser(admin: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db.insert(adminUsers).values(admin).returning();
    return newAdmin;
  }

  async updateEmergencyHospital(id: number, updates: Partial<InsertEmergencyHospital>): Promise<EmergencyHospital | undefined> {
    const [updated] = await db
      .update(emergencyHospitals)
      .set(updates)
      .where(eq(emergencyHospitals.id, id))
      .returning();
    return updated || undefined;
  }

  async updatePetService(id: number, updates: Partial<InsertPetService>): Promise<PetService | undefined> {
    const [updated] = await db
      .update(petServices)
      .set(updates)
      .where(eq(petServices.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEmergencyHospital(id: number): Promise<void> {
    await db.delete(emergencyHospitals).where(eq(emergencyHospitals.id, id));
  }

  async deletePetService(id: number): Promise<void> {
    await db.delete(petServices).where(eq(petServices.id, id));
  }
}

export const storage = new DatabaseStorage();
