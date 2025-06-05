import React from 'react';
import { Link } from 'react-router-dom';
import type { Item } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ItemCardProps {
  item: Item;
  onStatusUpdate?: (itemId: number, newStatus: string) => void;
  onDelete?: (itemId: number) => void;
  onRequestItem?: (itemId: number) => void;
  showActions?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onStatusUpdate, 
  onDelete, 
  onRequestItem, 
  showActions = false 
}) => {
  const { user } = useAuth();

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'LOST':
        return 'bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'FOUND':
        return 'bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'CLAIMED':
        return 'bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  const canModify = user && (
    user.role === 'ADMIN' || 
    user.role === 'STAFF' || 
    user.id === item.reportedById
  );

  const canRequestItem = user && (
    item.status === 'FOUND' && 
    user.id !== item.reportedById &&
    onRequestItem
  );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden p-5 border border-gray-100">
      {/* Item Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <span className={getStatusClass(item.status)}>
          {item.status}
        </span>
      </div>

      {/* Item Details */}
      <div className="space-y-3 mb-4">
        <p className="text-gray-600">{item.description}</p>
        
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {item.locationFound}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {item.category}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
          </svg>
          {new Date(item.dateReported).toLocaleDateString()}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Reported by: {item.reportedByUsername}
        </div>

        {item.claimedByUsername && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Claimed by: {item.claimedByUsername}
          </div>
        )}

        {item.heldByUsername && (
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Held by: {item.heldByUsername}
          </div>
        )}
      </div>

      {/* Actions */}
      {(canRequestItem || (showActions && canModify)) && (
        <div className="flex gap-2 pt-4 border-t border-gray-200 justify-between">
          {/* Request Item Button for regular users */}
          {canRequestItem && (
            <button
              onClick={() => onRequestItem!(item.id)}
              className="inline-flex items-center px-3 py-2 border border-emerald-300 text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Request Item
            </button>
          )}

          {/* Admin/Staff Actions */}
          {showActions && canModify && (
            <div className="flex gap-2 ml-auto">
              <Link
                to={`/items/${item.id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-emerald-300 text-xs font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>

              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard;