import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
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
  if (!response.data.items || !Array.isArray(response.data.items)) {
    throw new Error('Invalid data format received from server');
  }
  return response.data.items.map((item: any) => ({
    id: item.id,
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
  if (!response.data.items || !Array.isArray(response.data.items)) {
    throw new Error('Invalid data format received from server');
  }
  const tools = response.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
    categories: Array.isArray(item.categories) ? item.categories : 
               Array.isArray(item.category) ? item.category :
               item.category ? [item.category] : [],
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
  if (!response.data.items || !Array.isArray(response.data.items)) {
    throw new Error('Invalid data format received from server');
  }
  return response.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
    categories: Array.isArray(item.categories) ? item.categories : 
               Array.isArray(item.category) ? item.category :
               item.category ? [item.category] : [],
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
  return {
    id: item.id,
    name: item.name,
    slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
    categories: Array.isArray(item.categories) ? item.categories : 
               Array.isArray(item.category) ? item.category :
               item.category ? [item.category] : [],
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
