import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: 'http://54.211.3.115:8080/api',
});

// Add auth token to outgoing requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  slug: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  short_description: string;
  logo: string;
  rating: number;
  pricing_type: string;
  website_url: string;
  created_at: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  // Check if response.data is an array directly or has items property
  const items = Array.isArray(response.data) ? response.data : 
                (response.data.items && Array.isArray(response.data.items)) ? response.data.items : 
                [];
  
  if (items.length === 0) {
    console.error('No categories found in response:', response.data);
    throw new Error('Invalid data format received from server');
  }
  
  return items.map((item: {
    id?: string;
    name: string;
    slug?: string;
    categories?: string[];
    category?: string[] | string;
    description?: string;
    short_description?: string;
    logo?: string;
    logo_url?: string;
    resource_url?: string;
    rating?: number;
    pricing_type?: string;
    type?: string;
    website_url?: string;
    created_at?: string | number | Date;
    icon?: string;
    count?: number;
  }) => ({
    id: item.id || `category-${Math.random().toString(36).substr(2, 9)}`,
    name: item.name,
    icon: item.icon || 'default-icon',
    count: item.count || 0,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-')
  }));
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export const getTools = async (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Tool>> => {
  const response = await api.get(`/tools?page=${page}&per_page=${perPage}`);
  // Check if response.data is an array directly or has items property
  const items = Array.isArray(response.data) ? response.data : 
                (response.data.items && Array.isArray(response.data.items)) ? response.data.items : 
                [];
  
  if (items.length === 0) {
    console.error('No items found in response:', response.data);
    throw new Error('Invalid data format received from server');
  }
  
  const tools = items.map((item: {
    id?: string;
    name: string;
    slug?: string;
    categories?: string[];
    category?: string[] | string;
    description?: string;
    short_description?: string;
    logo?: string;
    logo_url?: string;
    resource_url?: string;
    rating?: number;
    pricing_type?: string;
    type?: string;
    website_url?: string;
    created_at?: string | number | Date;
  }) => ({
    id: item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
    categories: Array.isArray(item.categories) ? item.categories : 
               Array.isArray(item.category) ? item.category :
               typeof item.category === 'string' ? [item.category] : [],
    short_description: item.description || item.short_description || '',
    logo: item.logo || item.logo_url || item.resource_url || '/placeholder.svg',
    rating: typeof item.rating === 'number' ? item.rating : 0,
    pricing_type: item.pricing_type || 
                 (item.type === 'free' ? 'Free' : 
                  item.type === 'freemium' ? 'Freemium' : 
                  item.type === 'paid' ? 'Paid' : 'Unknown'),
    website_url: item.website_url || item.resource_url || '',
    created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString()
  }));
  
  return {
    data: tools,
    total: response.data.total || tools.length,
    page: response.data.page || page,
    per_page: response.data.per_page || perPage,
    total_pages: response.data.total_pages || Math.ceil(tools.length / perPage)
  };
};

export const getToolsByCategory = async (categorySlug: string): Promise<Tool[]> => {
  const response = await api.get(`/categories/${categorySlug}/tools`);
  // Check if response.data is an array directly (some APIs return array at top level)
  const items = Array.isArray(response.data) ? response.data : 
                (response.data.items && Array.isArray(response.data.items)) ? response.data.items : 
                [];
  
  if (items.length === 0) {
    console.error('No items found in response:', response.data);
    throw new Error('Invalid data format received from server');
  }
  
  return items.map((item: {
    id?: string;
    name: string;
    slug?: string;
    categories?: string[];
    category?: string[] | string;
    description?: string;
    short_description?: string;
    logo?: string;
    logo_url?: string;
    resource_url?: string;
    rating?: number;
    pricing_type?: string;
    type?: string;
    website_url?: string;
    created_at?: string | number | Date;
    icon?: string;
    count?: number;
  }) => ({
    id: item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
    categories: Array.isArray(item.categories) ? item.categories : 
               Array.isArray(item.category) ? item.category :
               typeof item.category === 'string' ? [item.category] : [],
    short_description: item.description || item.short_description || '',
    logo: item.logo || item.logo_url || item.resource_url || '/placeholder.svg',
    rating: typeof item.rating === 'number' ? item.rating : 0,
    pricing_type: item.pricing_type || 
                 (item.type === 'free' ? 'Free' : 
                  item.type === 'freemium' ? 'Freemium' : 
                  item.type === 'paid' ? 'Paid' : 'Unknown'),
    website_url: item.website_url || item.resource_url || '',
    created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString()
  }));
};

export const getToolBySlug = async (slug: string): Promise<Tool> => {
  const response = await api.get(`/tools/${slug}`);
  const item = response.data;
  
  if (!item || !item.id) {
    console.error('Invalid tool data received:', item);
    throw new Error('Invalid tool data received from server');
  }
  
  return {
    id: item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
    categories: Array.isArray(item.categories) ? item.categories : 
               Array.isArray(item.category) ? item.category :
               typeof item.category === 'string' ? [item.category] : [],
    short_description: item.description || item.short_description || '',
    logo: item.logo || item.logo_url || item.resource_url || '/placeholder.svg',
    rating: typeof item.rating === 'number' ? item.rating : 0,
    pricing_type: item.pricing_type || 
                 (item.type === 'free' ? 'Free' : 
                  item.type === 'freemium' ? 'Freemium' : 
                  item.type === 'paid' ? 'Paid' : 'Unknown'),
    website_url: item.website_url || item.resource_url || '',
    created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString()
  };
};

export interface SearchResult {
  type: 'tool' | 'news';
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  url: string;
}

export interface SearchResponse {
  items: SearchResult[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  query: string;
  content_type: string;
}

export const searchTools = async (
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<SearchResponse> => {
  const response = await api.get<SearchResponse>(
    `/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&sort_by=relevance&sort_order=-1`
  );
  return response.data;
};
