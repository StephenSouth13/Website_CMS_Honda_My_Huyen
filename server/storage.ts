import { 
  users, motorcycles, testDriveRequests, contactRequests, promotions, services,
  type User, type InsertUser, type Motorcycle, type InsertMotorcycle,
  type TestDriveRequest, type InsertTestDriveRequest,
  type ContactRequest, type InsertContactRequest,
  type Promotion, type InsertPromotion,
  type Service, type InsertService
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Motorcycles
  getMotorcycles(): Promise<Motorcycle[]>;
  getMotorcyclesByCategory(category: string): Promise<Motorcycle[]>;
  getFeaturedMotorcycles(): Promise<Motorcycle[]>;
  getMotorcycle(id: number): Promise<Motorcycle | undefined>;
  getMotorcycleBySlug(slug: string): Promise<Motorcycle | undefined>;
  createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle>;
  
  // Test Drive Requests
  getTestDriveRequests(): Promise<TestDriveRequest[]>;
  getTestDriveRequest(id: number): Promise<TestDriveRequest | undefined>;
  createTestDriveRequest(request: InsertTestDriveRequest): Promise<TestDriveRequest>;
  updateTestDriveRequestStatus(id: number, status: string): Promise<TestDriveRequest | undefined>;
  
  // Contact Requests
  getContactRequests(): Promise<ContactRequest[]>;
  getContactRequest(id: number): Promise<ContactRequest | undefined>;
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  
  // Promotions
  getPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  
  // Services
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private motorcycles: Map<number, Motorcycle>;
  private testDriveRequests: Map<number, TestDriveRequest>;
  private contactRequests: Map<number, ContactRequest>;
  private promotions: Map<number, Promotion>;
  private services: Map<number, Service>;
  private currentUserId: number;
  private currentMotorcycleId: number;
  private currentTestDriveId: number;
  private currentContactId: number;
  private currentPromotionId: number;
  private currentServiceId: number;

  constructor() {
    this.users = new Map();
    this.motorcycles = new Map();
    this.testDriveRequests = new Map();
    this.contactRequests = new Map();
    this.promotions = new Map();
    this.services = new Map();
    this.currentUserId = 1;
    this.currentMotorcycleId = 1;
    this.currentTestDriveId = 1;
    this.currentContactId = 1;
    this.currentPromotionId = 1;
    this.currentServiceId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed motorcycles
    const motorcycleData: InsertMotorcycle[] = [
      {
        name: "Honda SH 350i",
        slug: "honda-sh-350i",
        category: "tay-ga",
        price: "189000000",
        originalPrice: "195000000",
        engine: "eSP+ 330cc",
        displacement: "330cc",
        fuelCapacity: "9.1L",
        weight: "184kg",
        description: "Xe tay ga cao cấp với động cơ 330cc mạnh mẽ, thiết kế sang trọng và công nghệ tiên tiến",
        features: ["Khởi động điện", "Phanh ABS", "Khoá thông minh", "Cổng sạc USB", "Đèn LED"],
        colors: ["Đỏ", "Đen", "Trắng", "Xanh"],
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        imageGallery: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isNew: true,
        isFeatured: true,
        inStock: true,
      },
      {
        name: "Honda Vision 2024",
        slug: "honda-vision-2024",
        category: "tay-ga",
        price: "36500000",
        originalPrice: "38000000",
        engine: "eSP 125cc",
        displacement: "125cc",
        fuelCapacity: "5.2L",
        weight: "115kg",
        description: "Xe tay ga thông minh với thiết kế trẻ trung, tiết kiệm nhiên liệu",
        features: ["Khởi động điện", "Phanh CBS", "Đèn LED", "Cốp rộng", "Tiết kiệm xăng"],
        colors: ["Đỏ", "Đen", "Trắng", "Xanh", "Hồng"],
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        imageGallery: ["https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isNew: false,
        isFeatured: true,
        inStock: true,
      },
      {
        name: "Honda Winner X",
        slug: "honda-winner-x",
        category: "con-tay",
        price: "46500000",
        originalPrice: "48000000",
        engine: "150cc",
        displacement: "150cc",
        fuelCapacity: "4.7L",
        weight: "134kg",
        description: "Xe số thể thao với động cơ 150cc mạnh mẽ, thiết kế thể thao năng động",
        features: ["Khởi động điện & kick", "Phanh đĩa trước", "Đèn LED", "Bánh xe hợp kim", "Bảng đồng hồ kỹ thuật số"],
        colors: ["Đỏ đen", "Xanh đen", "Trắng đen"],
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        imageGallery: ["https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isNew: false,
        isFeatured: true,
        inStock: true,
      },
      {
        name: "Honda Wave RSX",
        slug: "honda-wave-rsx",
        category: "so-san",
        price: "23500000",
        originalPrice: "24000000",
        engine: "110cc",
        displacement: "110cc",
        fuelCapacity: "3.7L",
        weight: "96kg",
        description: "Xe số tiết kiệm với thiết kế đơn giản, phù hợp cho di chuyển hàng ngày",
        features: ["Khởi động kick", "Phanh trống", "Đèn halogen", "Yên đôi", "Baga sau"],
        colors: ["Đỏ", "Đen", "Xanh"],
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        imageGallery: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        isNew: false,
        isFeatured: false,
        inStock: true,
      }
    ];

    motorcycleData.forEach(data => {
      const motorcycle: Motorcycle = { ...data, id: this.currentMotorcycleId++, createdAt: new Date() };
      this.motorcycles.set(motorcycle.id, motorcycle);
    });

    // Seed promotions
    const promotionData: InsertPromotion[] = [
      {
        title: "Ưu đãi đầu năm 2025",
        description: "Khuyến mãi lớn nhất trong năm với nhiều ưu đãi hấp dẫn",
        discountAmount: "5000000",
        discountPercentage: null,
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        isActive: true,
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        conditions: ["Áp dụng cho khách hàng mua xe trong tháng 1", "Tặng bảo hiểm xe máy 1 năm", "Tặng phụ kiện chính hãng Honda"],
      }
    ];

    promotionData.forEach(data => {
      const promotion: Promotion = { ...data, id: this.currentPromotionId++, createdAt: new Date() };
      this.promotions.set(promotion.id, promotion);
    });

    // Seed services
    const serviceData: InsertService[] = [
      {
        name: "Bảo trì định kỳ",
        description: "Dịch vụ bảo trì định kỳ theo đúng khuyến nghị của Honda để xe luôn hoạt động tốt nhất",
        price: "150000",
        duration: "1-2 giờ",
        category: "maintenance",
      },
      {
        name: "Sửa chữa chuyên sâu",
        description: "Sửa chữa các hư hỏng phức tạp với đội ngũ kỹ thuật viên chuyên nghiệp",
        price: "500000",
        duration: "2-4 giờ",
        category: "repair",
      },
      {
        name: "Bảo hành chính hãng",
        description: "Bảo hành chính hãng Honda với phụ tung và linh kiện 100% chính hãng",
        price: "0",
        duration: "30 phút - 2 giờ",
        category: "warranty",
      }
    ];

    serviceData.forEach(data => {
      const service: Service = { ...data, id: this.currentServiceId++, createdAt: new Date() };
      this.services.set(service.id, service);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Motorcycle methods
  async getMotorcycles(): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values());
  }

  async getMotorcyclesByCategory(category: string): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values()).filter(bike => bike.category === category);
  }

  async getFeaturedMotorcycles(): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values()).filter(bike => bike.isFeatured);
  }

  async getMotorcycle(id: number): Promise<Motorcycle | undefined> {
    return this.motorcycles.get(id);
  }

  async getMotorcycleBySlug(slug: string): Promise<Motorcycle | undefined> {
    return Array.from(this.motorcycles.values()).find(bike => bike.slug === slug);
  }

  async createMotorcycle(insertMotorcycle: InsertMotorcycle): Promise<Motorcycle> {
    const id = this.currentMotorcycleId++;
    const motorcycle: Motorcycle = { ...insertMotorcycle, id, createdAt: new Date() };
    this.motorcycles.set(id, motorcycle);
    return motorcycle;
  }

  // Test Drive Request methods
  async getTestDriveRequests(): Promise<TestDriveRequest[]> {
    return Array.from(this.testDriveRequests.values());
  }

  async getTestDriveRequest(id: number): Promise<TestDriveRequest | undefined> {
    return this.testDriveRequests.get(id);
  }

  async createTestDriveRequest(insertRequest: InsertTestDriveRequest): Promise<TestDriveRequest> {
    const id = this.currentTestDriveId++;
    const request: TestDriveRequest = { ...insertRequest, id, status: "pending", createdAt: new Date() };
    this.testDriveRequests.set(id, request);
    return request;
  }

  async updateTestDriveRequestStatus(id: number, status: string): Promise<TestDriveRequest | undefined> {
    const request = this.testDriveRequests.get(id);
    if (request) {
      const updatedRequest = { ...request, status };
      this.testDriveRequests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  // Contact Request methods
  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }

  async getContactRequest(id: number): Promise<ContactRequest | undefined> {
    return this.contactRequests.get(id);
  }

  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = this.currentContactId++;
    const request: ContactRequest = { ...insertRequest, id, status: "new", createdAt: new Date() };
    this.contactRequests.set(id, request);
    return request;
  }

  // Promotion methods
  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values());
  }

  async getActivePromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).filter(promo => promo.isActive);
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const id = this.currentPromotionId++;
    const promotion: Promotion = { ...insertPromotion, id, createdAt: new Date() };
    this.promotions.set(id, promotion);
    return promotion;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.category === category);
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id, createdAt: new Date() };
    this.services.set(id, service);
    return service;
  }
}

export const storage = new MemStorage();
