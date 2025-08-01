export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  inStock: boolean;
  inventory: number;
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
  category: string[];
  subCategory: string[];
  color: string[];
  size: string[];
  priceRange: [number, number];
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  skuCode: string;
  quantity: number;
  size?: string;
  color?: string;
  product: Product;
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
      colorcode?: {
        hsl: {
          h: number;
          s: number;
          l: number;
          a: number;
        };
        hex: string;
        rgb: {
          r: number;
          g: number;
          b: number;
          a: number;
        };
        hsv: {
          h: number;
          s: number;
          v: number;
          a: number;
        };
        oldHue: number;
        source: string;
      };
      created_at: string;
      created_by: string;
      description?: string;
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
      description?: string;
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
      uid: string;
      _content_type_uid: string;
      colorcode?: {
        hsl: {
          h: number;
          s: number;
          l: number;
          a: number;
        };
        hex: string;
        rgb: {
          r: number;
          g: number;
          b: number;
          a: number;
        };
        hsv: {
          h: number;
          s: number;
          v: number;
          a: number;
        };
        oldHue: number;
        source: string;
      };
      title?: string;
      description?: string;
    }>;
    size: Array<{
      uid: string;
      _content_type_uid: string;
      title?: string;
      description?: string;
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
  gender?: string | string[];
  class?: string;
  category?: string | string[];
  subCategory?: string | string[];
  color?: string | string[];
  size?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Algolia types
export interface AlgoliaSearchParams {
  query?: string;
  filters?: string;
  facets?: string[];
  facetFilters?: string[][];
  numericFilters?: string[];
  page?: number;
  hitsPerPage?: number;
  sortBy?: string;
}

export interface AlgoliaSearchResponse {
  hits: DetailedProduct[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets?: Record<string, Record<string, number>>;
  facetStats?: Record<string, { min: number; max: number }>;
}

export interface AlgoliaFacet {
  name: string;
  values: Array<{
    value: string;
    count: number;
  }>;
}
