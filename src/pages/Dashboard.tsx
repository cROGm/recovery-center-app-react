// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import apiService from '../services/api';
// import ItemCard from '../components/ItemCard';
// import type { Item } from '../types';

// interface DashboardStats {
//   totalItems: number;
//   lostItems: number;
//   foundItems: number;
//   claimedItems: number;
// }

// const Dashboard: React.FC = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalItems: 0,
//     lostItems: 0,
//     foundItems: 0,
//     claimedItems: 0,
//   });
//   const [recentItems, setRecentItems] = useState<Item[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch all items for stats
//         const allItems = await apiService.getAllItems();
        
//         // Calculate stats
//         const lostItems = allItems.filter(item => item.status === 'LOST').length;
//         const foundItems = allItems.filter(item => item.status === 'FOUND').length;
//         const claimedItems = allItems.filter(item => item.status === 'CLAIMED').length;

//         setStats({
//           totalItems: allItems.length,
//           lostItems,
//           foundItems,
//           claimedItems,
//         });

//         // Get recent items (last 5)
//         const recentItems = allItems
//           .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//           .slice(0, 5);
//         setRecentItems(recentItems);

//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         // Set default values on error to prevent crash
//         setStats({
//           totalItems: 0,
//           lostItems: 0,
//           foundItems: 0,
//           claimedItems: 0,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const handleStatusUpdate = async (itemId: number, newStatus: string) => {
//     try {
//       await apiService.updateItemStatus(itemId, newStatus);
//       // Refresh dashboard data after status update
//       const allItems = await apiService.getAllItems();
      
//       // Calculate stats
//       const lostItems = allItems.filter(item => item.status === 'LOST').length;
//       const foundItems = allItems.filter(item => item.status === 'FOUND').length;
//       const claimedItems = allItems.filter(item => item.status === 'CLAIMED').length;

//       setStats({
//         totalItems: allItems.length,
//         lostItems,
//         foundItems,
//         claimedItems,
//       });

//       // Update recent items
//       const recentItems = allItems
//         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//         .slice(0, 5);
//       setRecentItems(recentItems);
      
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
//       // Refresh dashboard data after deletion
//       const allItems = await apiService.getAllItems();
      
//       // Calculate stats
//       const lostItems = allItems.filter(item => item.status === 'LOST').length;
//       const foundItems = allItems.filter(item => item.status === 'FOUND').length;
//       const claimedItems = allItems.filter(item => item.status === 'CLAIMED').length;

//       setStats({
//         totalItems: allItems.length,
//         lostItems,
//         foundItems,
//         claimedItems,
//       });

//       // Update recent items
//       const recentItems = allItems
//         .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//         .slice(0, 5);
//       setRecentItems(recentItems);
      
//       setSuccessMessage('Item deleted successfully!');
//       setTimeout(() => setSuccessMessage(null), 5000);
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       alert('Failed to delete item. Please try again.');
//     }
//   };

//   const getStatusClass = (status: string) => {
//     switch (status) {
//       case 'LOST':
//         return 'status-lost';
//       case 'FOUND':
//         return 'status-found';
//       case 'CLAIMED':
//         return 'status-claimed';
//       default:
//         return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
//     }
//   };

//   // Function to get display name
//   const getDisplayName = () => {
//     if (!user) return 'User';
//     if (user.firstName) {
//       return user.firstName;
//     }
//     return user.username;
//   };

//   const isStaffOrAdmin = user && (user.role === 'STAFF' || user.role === 'ADMIN');

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
//                 <div className="-mx-1.5 -my-1.5">
//                   <button
//                     onClick={() => setSuccessMessage(null)}
//                     className="inline-flex bg-emerald-50 rounded-md p-1.5 text-emerald-500 hover:bg-emerald-100 transition-colors"
//                   >
//                     <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Welcome Section */}
//         <div className="px-4 py-6 sm:px-0">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {getDisplayName()}!
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Here's what's happening in the Recovery Center system
//           </p>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           {/* Recent Items */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Recent Items</h2>
//               <Link
//                 to="/items"
//                 className="text-emerald-600 hover:text-emerald-500 text-sm font-medium transition-colors"
//               >
//                 View all
//               </Link>
//             </div>
            
//             {recentItems.length === 0 ? (
//               <p className="text-gray-500 text-center py-4">No items reported yet</p>
//             ) : (
//               <div className="space-y-3">
//                 {recentItems.map((item) => (
//                   <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <div className="flex-1">
//                       <h3 className="font-medium text-gray-900">{item.name}</h3>
//                       <p className="text-sm text-gray-600">{item.locationFound}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(item.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <span className={getStatusClass(item.status)}>
//                       {item.status}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//            {/* Quick Actions */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
//             <div className="space-y-4">
//               {isStaffOrAdmin && (
//                 <Link
//                   to="/items/add"
//                   className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-center"
//                 >
//                   <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   Add New Item
//                 </Link>
//               )}
              
//               <Link
//                 to="/items"
//                 className="block w-full px-4 py-3 border border-emerald-300 text-emerald-700 bg-emerald-50 font-medium rounded-lg hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-sm text-center"
//               >
//                 Browse All Items
//               </Link>
              
//               <Link
//                 to="/my-requests"
//                 className="block w-full px-4 py-3 border border-teal-300 text-teal-700 bg-teal-50 font-medium rounded-lg hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-sm text-center"
//               >
//                 My Requests
//               </Link>
//             </div>
//           </div>
//         </div>

//                 {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
//             <div className="flex items-center">
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Items</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
//             <div className="flex items-center">
//               <div className="p-2 bg-amber-100 rounded-lg">
//                 <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Lost Items</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.lostItems}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
//             <div className="flex items-center">
//               <div className="p-2 bg-emerald-100 rounded-lg">
//                 <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Found Items</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.foundItems}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
//             <div className="flex items-center">
//               <div className="p-2 bg-teal-100 rounded-lg">
//                 <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Claimed Items</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.claimedItems}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Admin/Staff Section */}
//         {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
//           <div className="mt-8">
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">System Management</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Link
//                   to="/manage-items"
//                   className="block p-5 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 shadow-sm"
//                 >
//                   <h3 className="font-medium text-emerald-900">Manage Items</h3>
//                   <p className="text-sm text-emerald-700 mt-1">Review and update all item statuses</p>
//                 </Link>
                
//                 <Link
//                   to="/manage-requests"
//                   className="block p-5 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors border border-teal-100 shadow-sm"
//                 >
//                   <h3 className="font-medium text-teal-900">Manage Requests</h3>
//                   <p className="text-sm text-teal-700 mt-1">
//                     Handle claim requests
//                   </p>
//                 </Link>
                
//                 {user?.role === 'ADMIN' && (
//                   <Link
//                     to="/manage-users"
//                     className="block p-5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm"
//                   >
//                     <h3 className="font-medium text-indigo-900">Manage Users</h3>
//                     <p className="text-sm text-indigo-700 mt-1">Manage user roles and permissions</p>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import ItemCard from '../components/ItemCard';
import type { Item } from '../types';

interface DashboardStats {
  totalItems: number;
  lostItems: number;
  foundItems: number;
  claimedItems: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    claimedItems: 0,
  });
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all items for stats
        const allItems = await apiService.getAllItems();
        
        // Calculate stats
        const lostItems = allItems.filter(item => item.status === 'LOST').length;
        const foundItems = allItems.filter(item => item.status === 'FOUND').length;
        const claimedItems = allItems.filter(item => item.status === 'CLAIMED').length;

        setStats({
          totalItems: allItems.length,
          lostItems,
          foundItems,
          claimedItems,
        });

        // Get recent items (last 5)
        const recentItems = allItems
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentItems(recentItems);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values on error to prevent crash
        setStats({
          totalItems: 0,
          lostItems: 0,
          foundItems: 0,
          claimedItems: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (itemId: number, newStatus: string) => {
    try {
      await apiService.updateItemStatus(itemId, newStatus);
      // Refresh dashboard data after status update
      const allItems = await apiService.getAllItems();
      
      // Calculate stats
      const lostItems = allItems.filter(item => item.status === 'LOST').length;
      const foundItems = allItems.filter(item => item.status === 'FOUND').length;
      const claimedItems = allItems.filter(item => item.status === 'CLAIMED').length;

      setStats({
        totalItems: allItems.length,
        lostItems,
        foundItems,
        claimedItems,
      });

      // Update recent items
      const recentItems = allItems
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentItems(recentItems);
      
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
      // Refresh dashboard data after deletion
      const allItems = await apiService.getAllItems();
      
      // Calculate stats
      const lostItems = allItems.filter(item => item.status === 'LOST').length;
      const foundItems = allItems.filter(item => item.status === 'FOUND').length;
      const claimedItems = allItems.filter(item => item.status === 'CLAIMED').length;

      setStats({
        totalItems: allItems.length,
        lostItems,
        foundItems,
        claimedItems,
      });

      // Update recent items
      const recentItems = allItems
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentItems(recentItems);
      
      setSuccessMessage('Item deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'LOST':
        return 'status-lost';
      case 'FOUND':
        return 'status-found';
      case 'CLAIMED':
        return 'status-claimed';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  // Function to get display name
  const getDisplayName = () => {
    if (!user) return 'User';
    if (user.firstName) {
      return user.firstName;
    }
    return user.username;
  };

  const isStaffOrAdmin = user && (user.role === 'STAFF' || user.role === 'ADMIN');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                <div className="-mx-1.5 -my-1.5">
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
          </div>
        )}

        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            👋 You're back! Welcome, {getDisplayName()}!
          </h1>
          <p className="mt-2 text-gray-600">
            Stay updated with the latest items and manage your lost and found activities
          </p>
        </div>

        {/* Recent Items and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Items */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Items</h2>
              <Link
                to="/items"
                className="text-emerald-600 hover:text-emerald-500 text-sm font-medium transition-colors"
              >
                View all
              </Link>
            </div>
            
            {recentItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items reported yet</p>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.locationFound}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {isStaffOrAdmin && (
                <Link
                  to="/items/add"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-center"
                >
                  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Item
                </Link>
              )}
              
              <Link
                to="/items"
                className="block w-full px-4 py-3 border border-emerald-300 text-emerald-700 bg-emerald-50 font-medium rounded-lg hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-sm text-center"
              >
                Browse All Items
              </Link>
              
              <Link
                to="/my-requests"
                className="block w-full px-4 py-3 border border-teal-300 text-teal-700 bg-teal-50 font-medium rounded-lg hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-sm text-center"
              >
                My Requests
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lost Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lostItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Found Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.foundItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Claimed Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.claimedItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin/Staff Section */}
        {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
          <div className="mt-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/manage-items"
                  className="block p-5 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 shadow-sm"
                >
                  <h3 className="font-medium text-emerald-900">Manage Items</h3>
                  <p className="text-sm text-emerald-700 mt-1">Review and update all item statuses</p>
                </Link>
                
                <Link
                  to="/manage-requests"
                  className="block p-5 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors border border-teal-100 shadow-sm"
                >
                  <h3 className="font-medium text-teal-900">Manage Requests</h3>
                  <p className="text-sm text-teal-700 mt-1">
                    Handle claim requests
                  </p>
                </Link>
                
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/manage-users"
                    className="block p-5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm"
                  >
                    <h3 className="font-medium text-indigo-900">Manage Users</h3>
                    <p className="text-sm text-indigo-700 mt-1">Manage user roles and permissions</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;