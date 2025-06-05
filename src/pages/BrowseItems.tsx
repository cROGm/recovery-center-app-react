// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import apiService from '../services/api';
// import ItemCard from '../components/ItemCard';
// import type { Item } from '../types';

// const BrowseItems: React.FC = () => {
//   const { user } = useAuth();
//   const [items, setItems] = useState<Item[]>([]);
//   const [filteredItems, setFilteredItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('ALL');
//   const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
//   const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
//   const [categories, setCategories] = useState<string[]>([]);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   useEffect(() => {
//     // Filter items based on search term, status, and category
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

//     if (categoryFilter !== 'ALL') {
//       filtered = filtered.filter(item => item.category === categoryFilter);
//     }

//     setFilteredItems(filtered);
//   }, [items, searchTerm, statusFilter, categoryFilter]);

//   const fetchItems = async () => {
//     try {
//       setLoading(true);
//       const allItems = await apiService.getAllItems();
//       setItems(allItems);
//       setFilteredItems(allItems);
      
//       // Extract unique categories for filter
//       const uniqueCategories = [...new Set(allItems.map(item => item.category))];
//       setCategories(uniqueCategories);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//     } finally {
//       setLoading(false);
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

//   const handleRequestItem = async (itemId: number) => {
//     try {
//       if (!user) {
//         alert('Please log in to request items.');
//         return;
//       }

//       const message = prompt('Optional: Add a message with your request:');
      
//       await apiService.createRequest({ 
//         itemId, 
//         message: message || undefined 
//       });
      
//       alert('Request submitted successfully! You can view your requests in the My Requests section.');
//     } catch (error) {
//       console.error('Error creating request:', error);
//       alert('Failed to submit request. Please try again.');
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
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
//           <p className="mt-2 text-gray-600">
//             Discover lost and found items in the system
//           </p>
//         </div>

//         {/* Controls Section */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
//             {/* Search and Filters */}
//             <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
//               {/* Search */}
//               <div className="flex-1">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search items by name, description, category, location..."
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

//               {/* Category Filter */}
//               <div className="w-48">
//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
//                 >
//                   <option value="ALL">All Categories</option>
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
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
//                 className={`px-4 py-2 text-sm font-medium border ${
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
//               {searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
//                 ? 'Try adjusting your search or filter criteria.' 
//                 : 'There are no items in the system yet.'
//               }
//             </p>
//           </div>
//         ) : viewMode === 'cards' ? (
//           /* Cards View */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredItems.map((item) => (
//               <ItemCard
//                 key={item.id}
//                 item={item}
//                 showActions={false}
//                 onRequestItem={handleRequestItem}
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

// export default BrowseItems;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import ItemCard from '../components/ItemCard';
import type { Item } from '../types';

const BrowseItems: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Filter items based on search term, status, and category
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

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, statusFilter, categoryFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const allItems = await apiService.getAllItems();
      setItems(allItems);
      setFilteredItems(allItems);
      
      // Extract unique categories for filter
      const uniqueCategories = [...new Set(allItems.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
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

  const handleRequestItem = async (itemId: number) => {
    try {
      if (!user) {
        alert('Please log in to request items.');
        return;
      }

      const message = prompt('Optional: Add a message with your request:');
      
      await apiService.createRequest({ 
        itemId, 
        message: message || undefined 
      });
      
      alert('Request submitted successfully! You can view your requests in the My Requests section.');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to submit request. Please try again.');
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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔍 Browse Here</h1>
          <p className="mt-2 text-gray-600">
            Browse lost and found items in the system
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Status Filter and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
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

              {/* Category Filter */}
              <div className="w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items by name, description, category, location..."
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
                className={`px-4 py-2 text-sm font-medium border ${
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
              {searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                ? 'Try adjusting your search or filter criteria.' 
                : 'There are no items in the system yet.'
              }
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                showActions={false}
                onRequestItem={handleRequestItem}
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

export default BrowseItems;