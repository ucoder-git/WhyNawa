import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertListingSchema, insertEmergencyBookingSchema, insertCommunityPostSchema, insertServiceInquirySchema, insertEmergencyHospitalSchema, insertPetServiceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Listings routes
  app.get("/api/listings", async (req, res) => {
    try {
      const { location, categoryId, search } = req.query;
      const listings = await storage.getListings(
        location as string,
        categoryId ? parseInt(categoryId as string) : undefined,
        search as string
      );
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getListingById(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      // Increment view count
      await storage.incrementViewCount(id);
      
      res.json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  app.post("/api/listings", async (req, res) => {
    try {
      const validatedData = insertListingSchema.parse(req.body);
      const listing = await storage.createListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid listing data", errors: error.errors });
      }
      console.error("Error creating listing:", error);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  app.post("/api/listings/:id/like", async (req, res) => {
    try {
      const listingId = parseInt(req.params.id);
      const { userId } = req.body;
      
      await storage.toggleListingLike(listingId, userId);
      res.json({ message: "Like toggled successfully" });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Emergency hospitals routes
  app.get("/api/emergency-hospitals", async (req, res) => {
    try {
      const { location } = req.query;
      const hospitals = await storage.getEmergencyHospitals(location as string);
      res.json(hospitals);
    } catch (error) {
      console.error("Error fetching emergency hospitals:", error);
      res.status(500).json({ message: "Failed to fetch emergency hospitals" });
    }
  });

  app.get("/api/emergency-hospitals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hospital = await storage.getEmergencyHospitalById(id);
      
      if (!hospital) {
        return res.status(404).json({ message: "Hospital not found" });
      }
      
      res.json(hospital);
    } catch (error) {
      console.error("Error fetching hospital:", error);
      res.status(500).json({ message: "Failed to fetch hospital" });
    }
  });

  // Emergency bookings routes
  app.get("/api/emergency-bookings", async (req, res) => {
    try {
      const bookings = await storage.getEmergencyBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching emergency bookings:", error);
      res.status(500).json({ message: "Failed to fetch emergency bookings" });
    }
  });

  app.post("/api/emergency-bookings", async (req, res) => {
    try {
      const validatedData = insertEmergencyBookingSchema.parse(req.body);
      const booking = await storage.createEmergencyBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      console.error("Error creating emergency booking:", error);
      res.status(500).json({ message: "Failed to create emergency booking" });
    }
  });

  app.patch("/api/emergency-bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const booking = await storage.updateEmergencyBooking(id, updates);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Error updating emergency booking:", error);
      res.status(500).json({ message: "Failed to update emergency booking" });
    }
  });

  // Pet services routes
  app.get("/api/pet-services", async (req, res) => {
    try {
      const { location, type } = req.query;
      const services = await storage.getPetServices(location as string, type as string);
      res.json(services);
    } catch (error) {
      console.error("Error fetching pet services:", error);
      res.status(500).json({ message: "Failed to fetch pet services" });
    }
  });

  // Community posts routes
  app.get("/api/community-posts", async (req, res) => {
    try {
      const { location, type } = req.query;
      const posts = await storage.getCommunityPosts(location as string, type as string);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post("/api/community-posts", async (req, res) => {
    try {
      const validatedData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      console.error("Error creating community post:", error);
      res.status(500).json({ message: "Failed to create community post" });
    }
  });

  // Emergency call endpoint
  app.post("/api/emergency-call", async (req, res) => {
    try {
      // This endpoint would integrate with a phone service in production
      // For now, we'll just log the emergency call request
      console.log("Emergency call requested:", req.body);
      res.json({ message: "Emergency call initiated", phone: "1588-0119" });
    } catch (error) {
      console.error("Error handling emergency call:", error);
      res.status(500).json({ message: "Failed to initiate emergency call" });
    }
  });

  // Service inquiries routes
  app.get("/api/service-inquiries", async (req, res) => {
    try {
      const { status } = req.query;
      const inquiries = await storage.getServiceInquiries(status as string);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching service inquiries:", error);
      res.status(500).json({ message: "Failed to fetch service inquiries" });
    }
  });

  app.post("/api/service-inquiries", async (req, res) => {
    try {
      const validatedData = insertServiceInquirySchema.parse(req.body);
      const inquiry = await storage.createServiceInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      }
      console.error("Error creating service inquiry:", error);
      res.status(500).json({ message: "Failed to create service inquiry" });
    }
  });

  app.put("/api/service-inquiries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const inquiry = await storage.updateServiceInquiry(id, updates);
      
      if (!inquiry) {
        return res.status(404).json({ message: "Service inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      console.error("Error updating service inquiry:", error);
      res.status(500).json({ message: "Failed to update service inquiry" });
    }
  });

  // Admin routes for managing services
  app.post("/api/admin/emergency-hospitals", async (req, res) => {
    try {
      const validatedData = insertEmergencyHospitalSchema.parse(req.body);
      const hospital = await storage.createEmergencyHospital(validatedData);
      res.status(201).json(hospital);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hospital data", errors: error.errors });
      }
      console.error("Error creating emergency hospital:", error);
      res.status(500).json({ message: "Failed to create emergency hospital" });
    }
  });

  app.put("/api/admin/emergency-hospitals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const hospital = await storage.updateEmergencyHospital(id, updates);
      
      if (!hospital) {
        return res.status(404).json({ message: "Emergency hospital not found" });
      }
      
      res.json(hospital);
    } catch (error) {
      console.error("Error updating emergency hospital:", error);
      res.status(500).json({ message: "Failed to update emergency hospital" });
    }
  });

  app.delete("/api/admin/emergency-hospitals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEmergencyHospital(id);
      res.json({ message: "Emergency hospital deleted successfully" });
    } catch (error) {
      console.error("Error deleting emergency hospital:", error);
      res.status(500).json({ message: "Failed to delete emergency hospital" });
    }
  });

  app.post("/api/admin/pet-services", async (req, res) => {
    try {
      const validatedData = insertPetServiceSchema.parse(req.body);
      const service = await storage.createPetService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      console.error("Error creating pet service:", error);
      res.status(500).json({ message: "Failed to create pet service" });
    }
  });

  app.put("/api/admin/pet-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const service = await storage.updatePetService(id, updates);
      
      if (!service) {
        return res.status(404).json({ message: "Pet service not found" });
      }
      
      res.json(service);
    } catch (error) {
      console.error("Error updating pet service:", error);
      res.status(500).json({ message: "Failed to update pet service" });
    }
  });

  app.delete("/api/admin/pet-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePetService(id);
      res.json({ message: "Pet service deleted successfully" });
    } catch (error) {
      console.error("Error deleting pet service:", error);
      res.status(500).json({ message: "Failed to delete pet service" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
