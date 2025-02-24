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
    <div className="group cursor-pointer">
      <Link to={url.replace('/tools/', '/tool/')} className="block">
        <div className="flex items-center space-x-4 p-4 hover:bg-purple-50 rounded-lg transition-colors">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type === 'tool' ? 'bg-purple-100' : 'bg-green-100'}`}>
            <span className={`text-sm font-medium ${type === 'tool' ? 'text-purple-800' : 'text-green-800'}`}>
              {type === 'tool' ? 'T' : 'N'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category}</span>
            <span className="text-xs text-gray-400">{formatDate(date)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResultCard;
