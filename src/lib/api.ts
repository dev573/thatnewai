// Re-export everything from the consolidated news API service
export {
  fetchNews,
  fetchNewsById,
  fetchTrending,
  fetchCategories,
  fetchStats,
  searchNews,
} from "@/services/newsApi";

export type {
  Article,
  Pagination,
  NewsListResponse,
  CategoryStat,
  StatsData,
} from "@/services/newsApi";
