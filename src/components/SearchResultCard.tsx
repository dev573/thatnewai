import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface SearchResultCardProps {
  type: 'tool' | 'news';
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  url: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  type,
  name,
  description,
  category,
  date,
  url,
}: SearchResultCardProps) => {
  return (
    <div className="h-full group">
      <Link to={url} className="block h-full">
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-purple-200">
          <div className="flex items-start justify-between mb-3">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${type === 'tool' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
              {type === 'tool' ? 'Tool' : 'News'}
            </span>
            <span className="text-sm text-gray-500">{formatDate(date)}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">{name}</h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full hover:bg-purple-50 hover:text-purple-700 transition-colors">{category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResultCard;
