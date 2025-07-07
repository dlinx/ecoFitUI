import { Stack } from 'contentstack';
import { ContentstackConfig, Product, Category, Banner, HomePage } from '../types';

class ContentstackService {
  private stack: Stack | null;
  private config: ContentstackConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY || '',
      deliveryToken: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN || '',
      environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT || 'development',
      region: import.meta.env.VITE_CONTENTSTACK_REGION || 'NA',
    };
    if (this.config.apiKey && this.config.deliveryToken) {
      this.stack = Stack({
        api_key: this.config.apiKey,
        delivery_token: this.config.deliveryToken,
        environment: this.config.environment,
        region: this.config.region as any,
      });
    } else {
      this.stack = null;
    }
  }

  async getProducts(params: any = {}): Promise<Product[]> {
    if (!this.stack) {
      throw new Error('Contentstack is not initialized');
    }

    try {
      const query = this.stack.ContentType('products').Query();

      if (params.gender) {
        query.where('gender', params.gender);
      }
      if (params.category) {
        query.where('category', params.category);
      }
      if (params.class) {
        query.where('class', params.class);
      }
      if (params.limit) {
        query.limit(params.limit);
      }
      if (params.skip) {
        query.skip(params.skip);
      }

      const result = await query.find();
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching products from Contentstack:', error);
      return this.getMockProducts();
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    if (!this.stack) {
      return this.getMockProduct(id);
    }

    try {
      const query = this.stack.ContentType('products').Entry(id);
      const result = await query.fetch();
      return result || null;
    } catch (error) {
      console.error('Error fetching product from Contentstack:', error);
      return this.getMockProduct(id);
    }
  }

  async getCategories(): Promise<Category[]> {
    if (!this.stack) {
      throw new Error('Contentstack is not initialized');
    }

    try {
      const query = this.stack.ContentType('categories').Query();
      const result = await query.find();
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching categories from Contentstack:', error);
      return this.getMockCategories();
    }
  }

  async getBanners(): Promise<Banner[]> {
    if (!this.stack) {
      return this.getMockBanners();
    }

    try {
      const query = this.stack.ContentType('banners').Query();
      query.where('is_active', true);
      const result = await query.find();
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching banners from Contentstack:', error);
      return this.getMockBanners();
    }
  }

  async getHomePage(): Promise<HomePage | null> {
    try {
      const query = this.stack!.ContentType('home_page').Query();
      query.limit(1);
      query.includeReference('app_navigation');
      query.includeReference('entry_banner.banner');
      query.includeReference('trending.trending_1.trending_items');
      query.includeReference('wishlist.wishlist_items.wishlist_items');
      const result = await query.toJSON().findOne();
      return result || null;
    } catch (error) {
      console.error('Error fetching home page from Contentstack:', error);
      return null;
    }
  }

  async searchProducts(searchQuery: string, filters: any = {}): Promise<Product[]> {
    if (!this.stack) {
      return this.getMockProducts().filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    try {
      const query = this.stack.ContentType('products').Query();

      if (searchQuery) {
        query.regex('title', searchQuery, 'i');
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          query.where(key, value as string | number | boolean);
        }
      });

      const result = await query.find();
      return result[0] || [];
    } catch (error) {
      console.error('Error searching products in Contentstack:', error);
      return this.getMockProducts();
    }
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        title: 'Eco-Friendly Yoga Mat',
        description: 'Premium natural rubber yoga mat with excellent grip and cushioning for all your practice needs.',
        price: 79.99,
        originalPrice: 99.99,
        images: ['https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800'],
        category: 'yoga',
        gender: 'unisex',
        class: 'fitness',
        tags: ['eco-friendly', 'yoga', 'exercise'],
        inStock: true,
        rating: 4.8,
        reviewCount: 127,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: '2',
        title: 'Organic Cotton Workout Set',
        description: 'Comfortable and breathable organic cotton workout set perfect for any fitness activity.',
        price: 89.99,
        originalPrice: 120.00,
        images: ['https://images.pexels.com/photos/6456206/pexels-photo-6456206.jpeg?auto=compress&cs=tinysrgb&w=800'],
        category: 'activewear',
        gender: 'women',
        class: 'apparel',
        tags: ['organic', 'cotton', 'workout'],
        inStock: true,
        rating: 4.6,
        reviewCount: 89,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
      },
      {
        id: '3',
        title: 'Sustainable Running Shoes',
        description: 'High-performance running shoes made from recycled materials with superior comfort and durability.',
        price: 149.99,
        originalPrice: 199.99,
        images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'],
        category: 'footwear',
        gender: 'men',
        class: 'shoes',
        tags: ['sustainable', 'running', 'recycled'],
        inStock: true,
        rating: 4.9,
        reviewCount: 234,
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-05T00:00:00Z',
      },
      {
        id: '4',
        title: 'Bamboo Water Bottle',
        description: 'Eco-friendly bamboo water bottle with stainless steel interior, keeps drinks cold for 24 hours.',
        price: 34.99,
        originalPrice: 45.00,
        images: ['https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=800'],
        category: 'accessories',
        gender: 'unisex',
        class: 'hydration',
        tags: ['bamboo', 'eco-friendly', 'hydration'],
        inStock: true,
        rating: 4.7,
        reviewCount: 156,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z',
      },
    ];
  }

  private getMockProduct(id: string): Product | null {
    return this.getMockProducts().find(p => p.id === id) || null;
  }

  private getMockCategories(): Category[] {
    return [
      {
        id: '1',
        name: 'Fitness Equipment',
        slug: 'fitness-equipment',
        description: 'High-quality fitness equipment for home and gym use',
        image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'unisex',
        class: 'fitness',
      },
      {
        id: '2',
        name: 'Activewear',
        slug: 'activewear',
        description: 'Comfortable and sustainable activewear for all activities',
        image: 'https://images.pexels.com/photos/6456206/pexels-photo-6456206.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'unisex',
        class: 'apparel',
      },
      {
        id: '3',
        name: 'Footwear',
        slug: 'footwear',
        description: 'Sustainable and high-performance footwear',
        image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        gender: 'unisex',
        class: 'shoes',
      },
    ];
  }

  private getMockBanners(): Banner[] {
    return [
      {
        id: '1',
        title: 'New Eco-Friendly Collection',
        subtitle: 'Discover our latest sustainable fitness gear',
        image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ctaText: 'Shop Now',
        ctaLink: '/collection/eco-friendly',
        isActive: true,
      },
      {
        id: '2',
        title: 'Summer Fitness Sale',
        subtitle: 'Up to 50% off on selected items',
        image: 'https://images.pexels.com/photos/6456206/pexels-photo-6456206.jpeg?auto=compress&cs=tinysrgb&w=1200',
        ctaText: 'View Deals',
        ctaLink: '/sale',
        isActive: true,
      },
    ];
  }
}

export default new ContentstackService();