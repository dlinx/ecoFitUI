import { Stack } from 'contentstack';
import { ContentstackConfig, Category, Banner, HomePage, DetailedProduct, ProductDetails } from '../types';

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
      if (import.meta.env.VITE_CONTENTSTACK_BASE_URL) {
        this.stack.setHost(import.meta.env.VITE_CONTENTSTACK_BASE_URL);
      }
    } else {
      this.stack = null;
    }
  }

  async getProducts(params: any = {}): Promise<ProductDetails[]> {
    if (!this.stack) {
      throw new Error('Contentstack is not initialized');
    }

    try {
      const query = this.stack.ContentType('product').Query();
      query.includeReference(['images', 'sku', 'category', 'class', 'gender', 'tags', 'description', 'sku.color', 'sku.size', 'sub_category', 'sku.sku_code']);
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

      const result = await query.toJSON().find();
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching products from Contentstack:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<DetailedProduct | null> {
    if (!this.stack) {
      throw new Error('Contentstack is not initialized');
    }

    try {
      const query = this.stack.ContentType('product').Entry(id);
      query.includeReference([
        // 'images',
        // 'sku',
        'category',
        // 'class',
        'gender',
        // 'tags',
        // 'description',
        'sku.color',
        'sku.size',
        'sub_category'
      ]);

      const result = await query.toJSON().fetch();
      return result || null;
    } catch (error) {
      console.error('Error fetching product from Contentstack:', error);
      throw new Error('Error fetching product from Contentstack');
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
      throw error;
    }
  }

  async getBanners(): Promise<Banner[]> {
    if (!this.stack) {
      throw new Error('Contentstack is not initialized');
    }

    try {
      const query = this.stack.ContentType('banners').Query();
      query.where('is_active', true);
      const result = await query.find();
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching banners from Contentstack:', error);
      throw error;
    }
  }

  async getHomePage(): Promise<HomePage | null> {
    try {
      const query = this.stack!.ContentType('home_page').Query();
      query.limit(1);
      query.includeReference(['app_navigation',
        // 'entry_banner.banner',
        'trending.trending_1.trending_items',
        'wishlist.wishlist_items.wishlist_items',
        // 'trending.trending_1.trending_items.sku',
        'trending.trending_1.trending_items.sku.color',
        'trending.trending_1.trending_items.sku.size',
        'trending.trending_1.trending_items.gender',
        // 'trending.trending_1.trending_items.class',
        'trending.trending_1.trending_items.category',
        'trending.trending_1.trending_items.sub_category'
      ]);
      const result = await query.toJSON().findOne();
      return result || null;
    } catch (error) {
      console.error('Error fetching home page from Contentstack:', error);
      return null;
    }
  }

  async searchProducts(searchQuery: string, filters: any = {}): Promise<DetailedProduct[]> {
    if (!this.stack) {
      throw new Error('Contentstack is not initialized');
    }

    try {
      const query = this.stack.ContentType('product').Query();

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
      throw error;
    }
  }
}

export default new ContentstackService();