// Database Models and API Response Types

export interface Tool {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  short_description: string;
  long_description?: string;
  logo: string;
  rating: number;
  pricing_type: 'Free' | 'Paid' | 'Freemium';
  website_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// API Endpoints Types
export interface GetToolsParams {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  sort_by?: 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface GetCategoriesParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// API Endpoints
export const API_ENDPOINTS = {
  tools: '/api/tools',
  categories: '/api/categories',
  featuredTools: '/api/tools/featured',
  toolBySlug: (slug: string) => `/api/tools/${slug}`,
  categoryBySlug: (slug: string) => `/api/categories/${slug}`,
  toolsByCategory: (categorySlug: string) => `/api/categories/${categorySlug}/tools`,
} as const;