export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  gender: 'men' | 'women' | 'unisex';
  class: string;
  tags: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  gender: 'men' | 'women' | 'unisex';
  class: string;
}

export interface Filter {
  gender: string[];
  class: string[];
  category: string[];
  priceRange: [number, number];
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface ContentstackConfig {
  apiKey: string;
  deliveryToken: string;
  environment: string;
  region: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

// Navigation types based on Contentstack response
export interface NavigationItem {
  title: string;
  href: string;
  uuid?: number;
}

export interface CategoryChild {
  category_title: NavigationItem;
  _metadata: {
    uid: string;
  };
  category_childs: NavigationItem[];
}

export interface NavigationGroup {
  class_title: NavigationItem;
  _metadata: {
    uid: string;
  };
  class_childrens: CategoryChild[];
}

export interface Menu {
  uid: string;
  title: string;
  navigation_group: NavigationGroup[];
  _metadata?: {
    uid: string;
  };
}

export interface EntryBanner {
  banner: {
    banner_header: string;
    banner_subtitle: string;
    price: string;
    banner_background: {
      url: string;
      title: string;
    };
    _metadata: {
      uid: string;
    };
  };
}

export interface TrendingProduct {
  uid: string;
  _version: number;
  locale: string;
  ACL: Record<string, any>;
  _in_progress: boolean;
  category: Array<{
    _content_type_uid: string;
    uid: string;
    _version: number;
    locale: string;
    ACL: Record<string, any>;
    _in_progress: boolean;
    created_at: string;
    created_by: string;
    description: string;
    tags: string[];
    title: string;
    updated_at: string;
    updated_by: string;
    publish_details: {
      time: string;
      user: string;
      environment: string;
      locale: string;
    };
  }>;
  class: Array<{
    _content_type_uid: string;
    uid: string;
    _version: number;
    locale: string;
    ACL: Record<string, any>;
    _in_progress: boolean;
    created_at: string;
    created_by: string;
    description: string;
    tags: string[];
    title: string;
    updated_at: string;
    updated_by: string;
    publish_details: {
      time: string;
      user: string;
      environment: string;
      locale: string;
    };
  }>;
  created_at: string;
  created_by: string;
  description: {
    details: string;
    material_and_care: string;
  };
  gender: Array<{
    _content_type_uid: string;
    uid: string;
    _version: number;
    locale: string;
    ACL: Record<string, any>;
    _in_progress: boolean;
    created_at: string;
    created_by: string;
    description: string;
    tags: string[];
    title: string;
    updated_at: string;
    updated_by: string;
    publish_details: {
      time: string;
      user: string;
      environment: string;
      locale: string;
    };
  }>;
  images: Array<{
    uid: string;
    _version: number;
    parent_uid: string | null;
    title: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    content_type: string;
    file_size: string;
    filename: string;
    ACL: Record<string, any>;
    is_dir: boolean;
    tags: string[];
    publish_details: {
      time: string;
      user: string;
      environment: string;
      locale: string;
    };
    url: string;
    permanent_url: string;
  }>;
  sku: Array<{
    sku_code: string;
    color: Array<{
      _content_type_uid: string;
      uid: string;
      _version: number;
      locale: string;
      ACL: Record<string, any>;
      _in_progress: boolean;
      created_at: string;
      created_by: string;
      description: string;
      tags: string[];
      title: string;
      updated_at: string;
      updated_by: string;
      publish_details: {
        time: string;
        user: string;
        environment: string;
        locale: string;
      };
    }>;
    size: Array<{
      _content_type_uid: string;
      uid: string;
      _version: number;
      locale: string;
      ACL: Record<string, any>;
      _in_progress: boolean;
      created_at: string;
      created_by: string;
      description: string;
      tags: string[];
      title: string;
      updated_at: string;
      updated_by: string;
      publish_details: {
        time: string;
        user: string;
        environment: string;
        locale: string;
      };
    }>;
    inventory: number | null;
    price: number;
    discount: number;
    _metadata: {
      uid: string;
    };
  }>;
  sub_category: Array<{
    _content_type_uid: string;
    uid: string;
    _version: number;
    locale: string;
    ACL: Record<string, any>;
    _in_progress: boolean;
    created_at: string;
    created_by: string;
    description: string;
    tags: string[];
    title: string;
    updated_at: string;
    updated_by: string;
    publish_details: {
      time: string;
      user: string;
      environment: string;
      locale: string;
    };
  }>;
  tags: string[];
  title: string;
  updated_at: string;
  updated_by: string;
  publish_details: {
    time: string;
    user: string;
    environment: string;
    locale: string;
  };
}

export interface DetailedProduct {
  uid: string;
  _version: number;
  locale: string;
  ACL: Record<string, any>;
  _in_progress: boolean;
  category: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  class: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  created_at: string;
  created_by: string;
  description: {
    details: string;
    material_and_care: string;
  };
  gender: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  images: Array<{
    uid: string;
    _version: number;
    parent_uid: string | null;
    title: string;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
    content_type: string;
    file_size: string;
    filename: string;
    ACL: Record<string, any>;
    is_dir: boolean;
    tags: string[];
    publish_details: {
      time: string;
      user: string;
      environment: string;
      locale: string;
    };
    url: string;
    permanent_url: string;
  }>;
  sku: Array<{
    sku_code: string;
    color: Array<{
      uid: string;
      _content_type_uid: string;
    }>;
    size: Array<{
      uid: string;
      _content_type_uid: string;
    }>;
    inventory: number | null;
    price: number;
    discount: number;
    _metadata: {
      uid: string;
    };
  }>;
  sub_category: Array<{
    uid: string;
    _content_type_uid: string;
  }>;
  tags: string[];
  title: string;
  updated_at: string;
  updated_by: string;
  publish_details: {
    time: string;
    user: string;
    environment: string;
    locale: string;
  };
}

// Alias for ProductDetails
export type ProductDetails = DetailedProduct;

export interface TrendingSection {
  trending_1: {
    trending_items: ProductDetails[];
    _metadata: {
      uid: string;
    };
  };
}

export interface WishlistSection {
  wishlist_items: {
    wishlist_items: Array<{
      uid: string;
      _content_type_uid: string;
    }>;
    _metadata: {
      uid: string;
    };
  };
}

export interface HomePage {
  uid: string;
  title: string;
  app_navigation: Menu[];
  entry_banner: EntryBanner[];
  trending: TrendingSection[];
  wishlist: WishlistSection[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  seoSection?: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}

export interface SearchParams {
  q?: string;
  gender?: string;
  class?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Utility function to transform TrendingProduct to Product
export const transformTrendingProductToProduct = (trendingProduct: TrendingProduct): Product => {
  const firstSku = trendingProduct.sku[0];
  const originalPrice = firstSku.price;
  const discountedPrice = firstSku.price * (1 - firstSku.discount / 100);
  
  return {
    id: trendingProduct.uid,
    title: trendingProduct.title,
    description: trendingProduct.description.details || trendingProduct.description.material_and_care,
    price: Math.round(discountedPrice),
    originalPrice: firstSku.discount > 0 ? originalPrice : undefined,
    images: trendingProduct.images.map(img => img.url),
    category: trendingProduct.category[0]?.uid || 'unknown',
    gender: trendingProduct.gender[0]?.uid === 'blt8fe78d2d00310008' ? 'men' : 
            trendingProduct.gender[0]?.uid === 'blt947a3e4c7341f648' ? 'women' : 'unisex',
    class: trendingProduct.class[0]?.uid || 'unknown',
    tags: trendingProduct.tags,
    inStock: firstSku.inventory !== null && firstSku.inventory > 0,
    rating: 4.5, // Default rating since it's not in the trending data
    reviewCount: Math.floor(Math.random() * 100) + 10, // Mock review count
    createdAt: trendingProduct.created_at,
    updatedAt: trendingProduct.updated_at,
  };
};