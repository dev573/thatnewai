import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api`,
});

// ---------- Types matching backend response ----------

export interface Article {
  _id: string;
  slug?: string;
  title: string;
  url: string;
  source: string;
  category: string;
  image_url: string | null;
  published_at: string;
  engagement_score: number;
  tags: string[];
  summary: string | null;
  content: string | null;
  original_title: string | null;
  meta_description?: string;
  fetched_at: string;
  metadata?: {
    authors?: string;
    abstract?: string;
    arxiv_id?: string;
    pdf_url?: string;
    hn_id?: number;
    comments?: number;
    language?: string;
    description?: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NewsListResponse {
  success: boolean;
  data: Article[];
  pagination: Pagination;
}

export interface SingleArticleResponse {
  success: boolean;
  data: Article;
}

export interface CategoryStat {
  category: string;
  count: number;
  latest: string;
}

export interface TrendingResponse {
  success: boolean;
  data: Article[];
}

export interface CategoriesResponse {
  success: boolean;
  data: CategoryStat[];
}

export interface StatsData {
  totalArticles: number;
  todayArticles: number;
  thisWeekArticles: number;
  activeSources: number;
  lastFetch: string;
  lastFetchDuration: number;
}

export interface StatsResponse {
  success: boolean;
  data: StatsData;
}

// ---------- API functions ----------

export const fetchNews = async (
  page: number = 1,
  limit: number = 20,
  options?: { category?: string; search?: string; source?: string }
): Promise<NewsListResponse> => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (options?.category) params.set("category", options.category);
  if (options?.search) params.set("search", options.search);
  if (options?.source) params.set("source", options.source);

  const { data } = await API.get<NewsListResponse>(`/news?${params}`);
  return data;
};

export const fetchNewsById = async (idOrSlug: string): Promise<Article> => {
  const { data } = await API.get<SingleArticleResponse>(`/news/${encodeURIComponent(idOrSlug)}`);
  return data.data;
};

export const fetchTrending = async (limit = 10, days = 3): Promise<Article[]> => {
  const { data } = await API.get<TrendingResponse>(
    `/news/trending?limit=${limit}&days=${days}`
  );
  return data.data;
};

export const fetchCategories = async (): Promise<CategoryStat[]> => {
  const { data } = await API.get<CategoriesResponse>("/news/categories");
  return data.data;
};

export const fetchStats = async (): Promise<StatsData> => {
  const { data } = await API.get<StatsResponse>("/stats");
  return data.data;
};

export const searchNews = async (
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<NewsListResponse> => {
  return fetchNews(page, limit, { search: query });
};
