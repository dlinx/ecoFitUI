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

export interface TrendingSection {
  trending_1: {
    trending_items: Array<{
      uid: string;
      _content_type_uid: string;
    }>;
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