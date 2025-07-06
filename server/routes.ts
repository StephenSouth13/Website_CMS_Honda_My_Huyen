import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTestDriveRequestSchema, 
  insertContactRequestSchema, 
  insertUserSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Motorcycles
  app.get("/api/motorcycles", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      let motorcycles;
      if (category) {
        motorcycles = await storage.getMotorcyclesByCategory(category as string);
      } else if (featured === 'true') {
        motorcycles = await storage.getFeaturedMotorcycles();
      } else {
        motorcycles = await storage.getMotorcycles();
      }
      
      res.json(motorcycles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motorcycles" });
    }
  });

  app.get("/api/motorcycles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycle(id);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      res.json(motorcycle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motorcycle" });
    }
  });

  app.get("/api/motorcycles/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const motorcycle = await storage.getMotorcycleBySlug(slug);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      res.json(motorcycle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motorcycle" });
    }
  });

  // Test Drive Requests
  app.post("/api/test-drive", async (req, res) => {
    try {
      const validatedData = insertTestDriveRequestSchema.parse(req.body);
      const request = await storage.createTestDriveRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create test drive request" });
    }
  });

  app.get("/api/test-drive", async (req, res) => {
    try {
      const requests = await storage.getTestDriveRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch test drive requests" });
    }
  });

  // Contact Requests
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const request = await storage.createContactRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact request" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const requests = await storage.getContactRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact requests" });
    }
  });

  // Promotions
  app.get("/api/promotions", async (req, res) => {
    try {
      const { active } = req.query;
      
      let promotions;
      if (active === 'true') {
        promotions = await storage.getActivePromotions();
      } else {
        promotions = await storage.getPromotions();
      }
      
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  // Services
  app.get("/api/services", async (req, res) => {
    try {
      const { category } = req.query;
      
      let services;
      if (category) {
        services = await storage.getServicesByCategory(category as string);
      } else {
        services = await storage.getServices();
      }
      
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // User registration and login
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username) || 
                          await storage.getUserByEmail(validatedData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username) || 
                   await storage.getUserByEmail(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
