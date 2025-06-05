// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import apiService from '../services/api';
// import type { Request, Item } from '../types';

// const MyRequests: React.FC = () => {
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
//   // Create Request Modal State
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [items, setItems] = useState<Item[]>([]);
//   const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
//   const [requestMessage, setRequestMessage] = useState('');
//   const [createLoading, setCreateLoading] = useState(false);

//   // Admin Notes Modal State
//   const [showAdminNotesModal, setShowAdminNotesModal] = useState(false);
//   const [adminNotesInput, setAdminNotesInput] = useState('');
//   const [pendingRequestAction, setPendingRequestAction] = useState<{
//     requestId: number;
//     status: 'APPROVED' | 'REJECTED';
//   } | null>(null);

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
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       let allRequests: Request[] = [];
      
//       if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
//         // Admin/Staff can see all requests using the admin endpoint
//         allRequests = await apiService.getAllRequests();
//       } else {
//         // Regular users see only their requests using the mine=true approach
//         allRequests = await apiService.getMyRequests();
//       }
      
//       setRequests(allRequests);
//     } catch (error) {
//       console.error('Error fetching requests:', error);
//       setRequests([]); // Set empty array on error to prevent showing stale data
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateRequest = async (requestId: number, status: 'APPROVED' | 'REJECTED', adminNotes?: string) => {
//     // Open modal to collect admin notes
//     setPendingRequestAction({ requestId, status });
//     setAdminNotesInput(adminNotes || '');
//     setShowAdminNotesModal(true);
//   };

//   const handleAdminNotesSubmit = async () => {
//     if (!pendingRequestAction) return;
    
//     // Validate admin notes
//     if (adminNotesInput.trim() === '') {
//       alert('Admin notes are required when approving or rejecting requests.');
//       return;
//     }

//     try {
//       await apiService.updateRequest(
//         pendingRequestAction.requestId, 
//         { 
//           status: pendingRequestAction.status, 
//           adminNotes: adminNotesInput.trim() 
//         }
//       );
      
//       // Close modal and reset state
//       setShowAdminNotesModal(false);
//       setPendingRequestAction(null);
//       setAdminNotesInput('');
      
//       // Refresh the requests list and show success message
//       await fetchRequests();
//       setSuccessMessage(`Request ${pendingRequestAction.status.toLowerCase()} successfully!`);
//       setTimeout(() => setSuccessMessage(null), 5000);
//     } catch (error) {
//       console.error('Error updating request:', error);
//       alert('Failed to update request. Please try again.');
//     }
//   };

//   const handleCloseAdminNotesModal = () => {
//     setShowAdminNotesModal(false);
//     setPendingRequestAction(null);
//     setAdminNotesInput('');
//   };

//   const handleDeleteRequest = async (requestId: number) => {
//     if (!window.confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
//       return;
//     }

//     console.log('Attempting to delete request. User:', user, 'Request ID:', requestId);

//     try {
//       await apiService.deleteRequest(requestId);
//       await fetchRequests(); // Refresh the requests list
//       setSuccessMessage('Request cancelled successfully!');
//       setTimeout(() => setSuccessMessage(null), 5000);
//     } catch (error) {
//       console.error('Error deleting request:', error);
//       alert('Failed to cancel request. Please try again.');
//     }
//   };

//   const handleOpenCreateModal = async () => {
//     try {
//       setCreateLoading(true);
//       const allItems = await apiService.getAllItems();
//       // Filter to show only FOUND items that the user didn't report
//       const availableItems = allItems.filter(item => 
//         item.status === 'FOUND' && item.reportedById !== user?.id
//       );
//       setItems(availableItems);
//       setShowCreateModal(true);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//       alert('Failed to load items. Please try again.');
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   const handleCreateRequest = async () => {
//     if (!selectedItemId) {
//       alert('Please select an item to request.');
//       return;
//     }

//     try {
//       setCreateLoading(true);
//       await apiService.createRequest({
//         itemId: selectedItemId,
//         message: requestMessage || undefined
//       });
      
//       // Reset form and close modal
//       setSelectedItemId(null);
//       setRequestMessage('');
//       setShowCreateModal(false);
      
//       // Refresh requests and show success message
//       await fetchRequests();
//       setSuccessMessage('Request created successfully!');
//       setTimeout(() => setSuccessMessage(null), 5000);
//     } catch (error) {
//       console.error('Error creating request:', error);
//       alert('Failed to create request. Please try again.');
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   const handleCloseCreateModal = () => {
//     setShowCreateModal(false);
//     setSelectedItemId(null);
//     setRequestMessage('');
//   };

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'PENDING':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'APPROVED':
//         return 'bg-green-100 text-green-800';
//       case 'REJECTED':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const filteredRequests = requests.filter(request => 
//     statusFilter === 'ALL' || request.status === statusFilter
//   );

//   const isAdminOrStaff = user && (user.role === 'ADMIN' || user.role === 'STAFF');

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
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {isAdminOrStaff ? 'Manage Requests' : 'My Requests'}
//               </h1>
//               <p className="mt-2 text-gray-600">
//                 {isAdminOrStaff 
//                   ? 'Review and manage all item claim requests in the system'
//                   : 'View and manage your item claim requests'
//                 }
//               </p>
//             </div>
//             {/* Create Request Button for all users */}
//             <button
//               onClick={handleOpenCreateModal}
//               disabled={createLoading}
//               className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md inline-flex items-center"
//             >
//               <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               {createLoading ? 'Loading...' : 'Create New Request'}
//             </button>
//           </div>
//         </div>

//         {/* Controls Section */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             {/* Status Filter */}
//             <div className="w-48">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
//               >
//                 <option value="ALL">All Statuses</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="APPROVED">Approved</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//             </div>

//             {/* Results Count */}
//             <div className="text-sm text-gray-600">
//               Showing {filteredRequests.length} of {requests.length} requests
//             </div>
//           </div>
//         </div>

//         {/* Content Section */}
//         {filteredRequests.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-md p-12 text-center">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
//             <p className="mt-2 text-gray-600">
//               {statusFilter !== 'ALL' 
//                 ? 'Try adjusting your filter criteria.' 
//                 : isAdminOrStaff 
//                   ? 'No requests have been made yet.'
//                   : "You haven't made any requests yet. Browse items to find something you're looking for!"
//               }
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredRequests.map((request) => (
//               <div key={request.id} className="bg-white rounded-xl shadow-md p-6">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         Request for: {request.itemName}
//                       </h3>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
//                         {request.status}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">Requester:</span> {request.requesterUsername}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           <span className="font-medium">Request Date:</span>{' '}
//                           {new Date(request.requestDate).toLocaleDateString()}
//                         </p>
//                         {request.resolutionDate && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">Resolution Date:</span>{' '}
//                             {new Date(request.resolutionDate).toLocaleDateString()}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         {request.message && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">Message:</span> {request.message}
//                           </p>
//                         )}
//                         {request.adminNotes && (
//                           <p className="text-sm text-gray-600">
//                             <span className="font-medium">Admin Notes:</span> {request.adminNotes}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6">
//                     {isAdminOrStaff && request.status === 'PENDING' && (
//                       <>
//                         <button
//                           onClick={() => handleUpdateRequest(request.id, 'APPROVED')}
//                           className="inline-flex items-center px-3 py-2 border border-emerald-300 text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
//                         >
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => handleUpdateRequest(request.id, 'REJECTED')}
//                           className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
//                         >
//                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                           Reject
//                         </button>
//                       </>
//                     )}

//                     {/* Users can cancel their own pending requests */}
//                     {!isAdminOrStaff && request.status === 'PENDING' && user?.id === request.requesterId && (
//                       <button
//                         onClick={() => handleDeleteRequest(request.id)}
//                         className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
//                       >
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Cancel Request
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Create Request Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//             <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
//               <div className="mt-3">
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-2xl font-semibold text-gray-900">Create New Request</h3>
//                   <button
//                     onClick={handleCloseCreateModal}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Modal Content */}
//                 <div className="space-y-4">
//                   {/* Item Selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Item to Request *
//                     </label>
//                     {items.length === 0 ? (
//                       <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
//                         No items available for request. Only found items that you didn't report can be requested.
//                       </p>
//                     ) : (
//                       <select
//                         value={selectedItemId || ''}
//                         onChange={(e) => setSelectedItemId(Number(e.target.value) || null)}
//                         className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all"
//                         required
//                       >
//                         <option value="">-- Select an item --</option>
//                         {items.map((item) => (
//                           <option key={item.id} value={item.id}>
//                             {item.name} - {item.category} (Found at: {item.locationFound})
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>

//                   {/* Selected Item Details */}
//                   {selectedItemId && (
//                     <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
//                       {(() => {
//                         const selectedItem = items.find(item => item.id === selectedItemId);
//                         return selectedItem ? (
//                           <div>
//                             <h4 className="font-medium text-emerald-900 mb-2">{selectedItem.name}</h4>
//                             <p className="text-sm text-emerald-700 mb-1">
//                               <span className="font-medium">Description:</span> {selectedItem.description}
//                             </p>
//                             <p className="text-sm text-emerald-700 mb-1">
//                               <span className="font-medium">Category:</span> {selectedItem.category}
//                             </p>
//                             <p className="text-sm text-emerald-700 mb-1">
//                               <span className="font-medium">Found at:</span> {selectedItem.locationFound}
//                             </p>
//                             <p className="text-sm text-emerald-700">
//                               <span className="font-medium">Reported by:</span> {selectedItem.reportedByUsername}
//                             </p>
//                           </div>
//                         ) : null;
//                       })()}
//                     </div>
//                   )}

//                   {/* Message */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Message (Optional)
//                     </label>
//                     <textarea
//                       value={requestMessage}
//                       onChange={(e) => setRequestMessage(e.target.value)}
//                       placeholder="Add any additional information about why you're requesting this item..."
//                       rows={3}
//                       className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all"
//                     />
//                   </div>
//                 </div>

//                 {/* Modal Actions */}
//                 <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={handleCloseCreateModal}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCreateRequest}
//                     disabled={!selectedItemId || createLoading}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm"
//                   >
//                     {createLoading ? 'Creating...' : 'Create Request'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Admin Notes Modal */}
//         {showAdminNotesModal && pendingRequestAction && (
//           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//             <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/3 shadow-lg rounded-xl bg-white">
//               <div className="mt-3">
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     {pendingRequestAction.status === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
//                   </h3>
//                   <button
//                     onClick={handleCloseAdminNotesModal}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* Modal Content */}
//                 <div className="space-y-4">
//                   <div className={`p-4 rounded-lg ${
//                     pendingRequestAction.status === 'APPROVED' 
//                       ? 'bg-emerald-50 border border-emerald-100' 
//                       : 'bg-red-50 border border-red-100'
//                   }`}>
//                     <p className={`text-sm ${
//                       pendingRequestAction.status === 'APPROVED' 
//                         ? 'text-emerald-800' 
//                         : 'text-red-800'
//                     }`}>
//                       You are about to <strong>{pendingRequestAction.status.toLowerCase()}</strong> this request. 
//                       Please provide detailed admin notes explaining your decision.
//                     </p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Admin Notes *
//                     </label>
//                     <textarea
//                       value={adminNotesInput}
//                       onChange={(e) => setAdminNotesInput(e.target.value)}
//                       placeholder={`Please provide a detailed explanation for ${pendingRequestAction.status.toLowerCase()} this request...`}
//                       rows={4}
//                       className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all"
//                       required
//                     />
//                     <p className="mt-1 text-xs text-gray-500">
//                       Admin notes are required and will be visible to the requester.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Modal Actions */}
//                 <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={handleCloseAdminNotesModal}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleAdminNotesSubmit}
//                     disabled={adminNotesInput.trim() === ''}
//                     className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 ${
//                       pendingRequestAction.status === 'APPROVED'
//                         ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
//                         : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
//                     } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
//                   >
//                     {pendingRequestAction.status === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyRequests;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { Request, Item } from '../types';

const MyRequests: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Create Request Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Admin Notes Modal State
  const [showAdminNotesModal, setShowAdminNotesModal] = useState(false);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [pendingRequestAction, setPendingRequestAction] = useState<{
    requestId: number;
    status: 'APPROVED' | 'REJECTED';
  } | null>(null);

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
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let allRequests: Request[] = [];
      
      if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
        // Admin/Staff can see all requests using the admin endpoint
        allRequests = await apiService.getAllRequests();
      } else {
        // Regular users see only their requests using the mine=true approach
        allRequests = await apiService.getMyRequests();
      }
      
      setRequests(allRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]); // Set empty array on error to prevent showing stale data
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId: number, status: 'APPROVED' | 'REJECTED', adminNotes?: string) => {
    // Open modal to collect admin notes
    setPendingRequestAction({ requestId, status });
    setAdminNotesInput(adminNotes || '');
    setShowAdminNotesModal(true);
  };

  const handleAdminNotesSubmit = async () => {
    if (!pendingRequestAction) return;
    
    // Validate admin notes
    if (adminNotesInput.trim() === '') {
      alert('Admin notes are required when approving or rejecting requests.');
      return;
    }

    try {
      await apiService.updateRequest(
        pendingRequestAction.requestId, 
        { 
          status: pendingRequestAction.status, 
          adminNotes: adminNotesInput.trim() 
        }
      );
      
      // Close modal and reset state
      setShowAdminNotesModal(false);
      setPendingRequestAction(null);
      setAdminNotesInput('');
      
      // Refresh the requests list and show success message
      await fetchRequests();
      setSuccessMessage(`Request ${pendingRequestAction.status.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please try again.');
    }
  };

  const handleCloseAdminNotesModal = () => {
    setShowAdminNotesModal(false);
    setPendingRequestAction(null);
    setAdminNotesInput('');
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to cancel this request? This action cannot be undone.')) {
      return;
    }

    console.log('Attempting to delete request. User:', user, 'Request ID:', requestId);

    try {
      await apiService.deleteRequest(requestId);
      await fetchRequests(); // Refresh the requests list
      setSuccessMessage('Request cancelled successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to cancel request. Please try again.');
    }
  };

  const handleOpenCreateModal = async () => {
    try {
      setCreateLoading(true);
      const allItems = await apiService.getAllItems();
      // Filter to show only FOUND items that the user didn't report
      const availableItems = allItems.filter(item => 
        item.status === 'FOUND' && item.reportedById !== user?.id
      );
      setItems(availableItems);
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to load items. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!selectedItemId) {
      alert('Please select an item to request.');
      return;
    }

    try {
      setCreateLoading(true);
      await apiService.createRequest({
        itemId: selectedItemId,
        message: requestMessage || undefined
      });
      
      // Reset form and close modal
      setSelectedItemId(null);
      setRequestMessage('');
      setShowCreateModal(false);
      
      // Refresh requests and show success message
      await fetchRequests();
      setSuccessMessage('Request created successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSelectedItemId(null);
    setRequestMessage('');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === 'ALL' || request.status === statusFilter
  );

  const isAdminOrStaff = user && (user.role === 'ADMIN' || user.role === 'STAFF');

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
            <h1 className="text-3xl font-bold text-gray-900">
              📋 {isAdminOrStaff ? 'Manage Requests' : 'My Requests'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isAdminOrStaff 
                ? 'Review and manage all item claim requests in the system'
                : 'View and respond to your item recovery requests'
              }
            </p>
            
            {/* Create Request Button moved here */}
            <div className="mt-4">
              <button
                onClick={handleOpenCreateModal}
                disabled={createLoading}
                className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md inline-flex items-center"
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {createLoading ? 'Loading...' : 'Add new request'}
              </button>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Status Filter */}
            <div className="w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
          </div>
        </div>

        {/* Content Section */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
            <p className="mt-2 text-gray-600">
              {statusFilter !== 'ALL' 
                ? 'Try adjusting your filter criteria.' 
                : isAdminOrStaff 
                  ? 'No requests have been made yet.'
                  : "You haven't made any requests yet. Browse items to find something you're looking for!"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Request for: {request.itemName}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Requester:</span> {request.requesterUsername}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Request Date:</span>{' '}
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                        {request.resolutionDate && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Resolution Date:</span>{' '}
                            {new Date(request.resolutionDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div>
                        {request.message && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Message:</span> {request.message}
                          </p>
                        )}
                        {request.adminNotes && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Admin Notes:</span> {request.adminNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6">
                    {isAdminOrStaff && request.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateRequest(request.id, 'APPROVED')}
                          className="inline-flex items-center px-3 py-2 border border-emerald-300 text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(request.id, 'REJECTED')}
                          className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </>
                    )}

                    {/* Users can cancel their own pending requests */}
                    {!isAdminOrStaff && request.status === 'PENDING' && user?.id === request.requesterId && (
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Request Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
              <div className="mt-3">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Create New Request</h3>
                  <button
                    onClick={handleCloseCreateModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-4">
                  {/* Item Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Item to Request *
                    </label>
                    {items.length === 0 ? (
                      <p className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                        No items available for request. Only found items that you didn't report can be requested.
                      </p>
                    ) : (
                      <select
                        value={selectedItemId || ''}
                        onChange={(e) => setSelectedItemId(Number(e.target.value) || null)}
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all"
                        required
                      >
                        <option value="">-- Select an item --</option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} - {item.category} (Found at: {item.locationFound})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Selected Item Details */}
                  {selectedItemId && (
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                      {(() => {
                        const selectedItem = items.find(item => item.id === selectedItemId);
                        return selectedItem ? (
                          <div>
                            <h4 className="font-medium text-emerald-900 mb-2">{selectedItem.name}</h4>
                            <p className="text-sm text-emerald-700 mb-1">
                              <span className="font-medium">Description:</span> {selectedItem.description}
                            </p>
                            <p className="text-sm text-emerald-700 mb-1">
                              <span className="font-medium">Category:</span> {selectedItem.category}
                            </p>
                            <p className="text-sm text-emerald-700 mb-1">
                              <span className="font-medium">Found at:</span> {selectedItem.locationFound}
                            </p>
                            <p className="text-sm text-emerald-700">
                              <span className="font-medium">Reported by:</span> {selectedItem.reportedByUsername}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Add any additional information about why you're requesting this item..."
                      rows={3}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCloseCreateModal}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateRequest}
                    disabled={!selectedItemId || createLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm"
                  >
                    {createLoading ? 'Creating...' : 'Create Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Notes Modal */}
        {showAdminNotesModal && pendingRequestAction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/3 shadow-lg rounded-xl bg-white">
              <div className="mt-3">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pendingRequestAction.status === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
                  </h3>
                  <button
                    onClick={handleCloseAdminNotesModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    pendingRequestAction.status === 'APPROVED' 
                      ? 'bg-emerald-50 border border-emerald-100' 
                      : 'bg-red-50 border border-red-100'
                  }`}>
                    <p className={`text-sm ${
                      pendingRequestAction.status === 'APPROVED' 
                        ? 'text-emerald-800' 
                        : 'text-red-800'
                    }`}>
                      You are about to <strong>{pendingRequestAction.status.toLowerCase()}</strong> this request. 
                      Please provide detailed admin notes explaining your decision.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes *
                    </label>
                    <textarea
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      placeholder={`Please provide a detailed explanation for ${pendingRequestAction.status.toLowerCase()} this request...`}
                      rows={4}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Admin notes are required and will be visible to the requester.
                    </p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCloseAdminNotesModal}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdminNotesSubmit}
                    disabled={adminNotesInput.trim() === ''}
                    className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 ${
                      pendingRequestAction.status === 'APPROVED'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
                  >
                    {pendingRequestAction.status === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;