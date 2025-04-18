// News API service
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  read_time: string;
  slug: string;
}

export interface NewsResponse {
  items: NewsItem[];
  // Add pagination fields if they exist in the API response
}

export const fetchNews = async (page: number = 1, perPage: number = 10): Promise<NewsResponse> => {
  try {
    const response = await fetch(`http://54.211.3.115:8080/api/news?page=${page}&per_page=${perPage}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchNewsById = async (slug: string): Promise<NewsItem | null> => {
  try {
    // Fetch news by slug
    const response = await fetch(`http://54.211.3.115:8080/api/news/${encodeURIComponent(slug)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    throw error;
  }
}; 