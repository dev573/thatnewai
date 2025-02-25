import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { getCategoryIcon } from '@/lib/categoryIcons';

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
            {type === 'tool' ? (
              <div className="text-purple-800">
                {React.createElement(getCategoryIcon(category), { className: 'w-5 h-5' })}
              </div>
            ) : (
              <span className="text-sm font-medium text-green-800">N</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {type === 'tool' && (
                <span className="mr-1">
                  {React.createElement(getCategoryIcon(category), { className: 'w-3 h-3' })}
                </span>
              )}
              {category}
            </span>
            <span className="text-xs text-gray-400">{formatDate(date)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResultCard;
