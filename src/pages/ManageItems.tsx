// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import apiService from '../services/api';
// import ItemCard from '../components/ItemCard';
// import type { Item } from '../types';

// const ManageItems: React.FC = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [items, setItems] = useState<Item[]>([]);
//   const [filteredItems, setFilteredItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('ALL');
//   const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

//   // Redirect if user is not staff/admin
//   if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
//     navigate('/dashboard');
//     return null;
//   }

//   // Check for success message from navigation state
//   useEffect(() => {
//     if (location.state?.message) {
//       setSuccessMessage(location.state.message);
//       // Clear the state to prevent showing the message on refresh
//       navigate(location.pathname, { replace: true });
      
//       // Auto-hide success message after 5 seconds
//       setTimeout(() => setSuccessMessage(null), 5000);
//     }
//   }, [location, navigate]);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   useEffect(() => {
//     // Filter items based on search term and status
//     let filtered = items;

//     if (searchTerm) {
//       filtered = filtered.filter(item =>
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.locationFound.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.reportedByUsername.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'ALL') {
//       filtered = filtered.filter(item => item.status === statusFilter);
//     }

//     setFilteredItems(filtered);
//   }, [items, searchTerm, statusFilter]);

//   const fetchItems = async () => {
//     try {
//       setLoading(true);
//       const allItems = await apiService.getAllItems();
//       setItems(allItems);
//       setFilteredItems(allItems);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (itemId: number, newStatus: string) => {
//     try {
//       await apiService.updateItemStatus(itemId, newStatus);
//       await fetchItems(); // Refresh the items list
//       setSuccessMessage('Item status updated successfully!');
//       setTimeout(() => setSuccessMessage(null), 5000);
//     } catch (error) {
//       console.error('Error updating item status:', error);
//       alert('Failed to update item status. Please try again.');
//     }
//   };

//   const handleDeleteItem = async (itemId: number) => {
//     if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await apiService.deleteItem(itemId);
//       await fetchItems(); // Refresh the items list
//       setSuccessMessage('Item deleted successfully!');
//       setTimeout(() => setSuccessMessage(null), 5000);
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       alert('Failed to delete item. Please try again.');
//     }
//   };

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'LOST':
//         return 'bg-red-100 text-red-800';
//       case 'FOUND':
//         return 'bg-green-100 text-green-800';
//       case 'CLAIMED':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-emerald-800">{successMessage}</p>
//               </div>
//               <div className="ml-auto pl-3">
//                 <button
//                   onClick={() => setSuccessMessage(null)}
//                   className="inline-flex bg-emerald-50 rounded-md p-1.5 text-emerald-500 hover:bg-emerald-100 transition-colors"
//                 >
//                   <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Manage Items</h1>
//               <p className="mt-2 text-gray-600">
//                 View, edit, and manage all lost and found items in the system
//               </p>
//             </div>
//             <Link
//               to="/items/add"
//               className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-md inline-flex items-center"
//             >
//               <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add New Item
//             </Link>
//           </div>
//         </div>

//         {/* Controls Section */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             {/* Search and Filter */}
//             <div className="flex flex-col sm:flex-row gap-4 flex-1">
//               {/* Search */}
//               <div className="flex-1">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search items by name, description, category, location, or reporter..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
//                   />
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Status Filter */}
//               <div className="w-48">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
//                 >
//                   <option value="ALL">All Statuses</option>
//                   <option value="LOST">Lost</option>
//                   <option value="FOUND">Found</option>
//                   <option value="CLAIMED">Claimed</option>
//                 </select>
//               </div>
//             </div>

//             {/* View Mode Toggle */}
//             <div className="flex rounded-lg shadow-sm overflow-hidden">
//               <button
//                 onClick={() => setViewMode('cards')}
//                 className={`px-4 py-2 text-sm font-medium border ${
//                   viewMode === 'cards'
//                     ? 'bg-emerald-600 text-white border-emerald-600'
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                 } transition-colors rounded-l-lg`}
//               >
//                 <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                 </svg>
//                 Cards
//               </button>
//               <button
//                 onClick={() => setViewMode('table')}
//                 className={`px-4 py-2 text-sm font-medium border-t border-r border-b ${
//                   viewMode === 'table'
//                     ? 'bg-emerald-600 text-white border-emerald-600'
//                     : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                 } transition-colors rounded-r-lg`}
//               >
//                 <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                 </svg>
//                 Table
//               </button>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="mt-4 text-sm text-gray-600">
//             Showing {filteredItems.length} of {items.length} items
//           </div>
//         </div>

//         {/* Content Section */}
//         {filteredItems.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-md p-12 text-center">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
//             <p className="mt-2 text-gray-600">
//               {searchTerm || statusFilter !== 'ALL' 
//                 ? 'Try adjusting your search or filter criteria.' 
//                 : 'Get started by adding your first item.'
//               }
//             </p>
//             {(!searchTerm && statusFilter === 'ALL') && (
//               <Link
//                 to="/items/add"
//                 className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-md"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Add New Item
//               </Link>
//             )}
//           </div>
//         ) : viewMode === 'cards' ? (
//           /* Cards View */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredItems.map((item) => (
//               <ItemCard
//                 key={item.id}
//                 item={item}
//                 onStatusUpdate={handleStatusUpdate}
//                 onDelete={handleDeleteItem}
//                 showActions={true}
//               />
//             ))}
//           </div>
//         ) : (
//           /* Table View */
//           <div className="bg-white shadow-md rounded-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Item
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Reported By
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredItems.map((item) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{item.name}</div>
//                           <div className="text-sm text-gray-500 truncate max-w-xs">
//                             {item.description}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.category}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.locationFound}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.reportedByUsername}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(item.dateReported).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           <Link
//                             to={`/items/${item.id}/edit`}
//                             className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
//                           >
//                             Edit
//                           </Link>
//                           <button
//                             onClick={() => handleDeleteItem(item.id)}
//                             className="text-red-600 hover:text-red-700 text-sm font-medium"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageItems;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import ItemCard from '../components/ItemCard';
import type { Item } from '../types';

const ManageItems: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Redirect if user is not staff/admin
  if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
    navigate('/dashboard');
    return null;
  }

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message on refresh
      navigate(location.pathname, { replace: true });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Filter items based on search term and status
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationFound.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reportedByUsername.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, statusFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const allItems = await apiService.getAllItems();
      setItems(allItems);
      setFilteredItems(allItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId: number, newStatus: string) => {
    try {
      await apiService.updateItemStatus(itemId, newStatus);
      await fetchItems(); // Refresh the items list
      setSuccessMessage('Item status updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Failed to update item status. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.deleteItem(itemId);
      await fetchItems(); // Refresh the items list
      setSuccessMessage('Item deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'LOST':
        return 'bg-red-100 text-red-800';
      case 'FOUND':
        return 'bg-green-100 text-green-800';
      case 'CLAIMED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-emerald-800">{successMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="inline-flex bg-emerald-50 rounded-md p-1.5 text-emerald-500 hover:bg-emerald-100 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📦 Manage Items</h1>
            <p className="mt-2 text-gray-600">
              Browse, update, and oversee all lost and found items in the system
            </p>
            <div className="mt-4">
              <Link
                to="/items/add"
                className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-md inline-flex items-center"
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Item
              </Link>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items by name, description, category, location, or reporter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="LOST">Lost</option>
                  <option value="FOUND">Found</option>
                  <option value="CLAIMED">Claimed</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 text-sm font-medium border ${
                  viewMode === 'cards'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } transition-colors rounded-l-lg`}
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm font-medium border-t border-r border-b ${
                  viewMode === 'table'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } transition-colors rounded-r-lg`}
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Table
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </div>
        </div>

        {/* Content Section */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
            <p className="mt-2 text-gray-600">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first item.'
              }
            </p>
            {(!searchTerm && statusFilter === 'ALL') && (
              <Link
                to="/items/add"
                className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Item
              </Link>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDeleteItem}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.locationFound}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.reportedByUsername}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.dateReported).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/items/${item.id}/edit`}
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageItems;