import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import ManageItems from './pages/ManageItems';
import BrowseItems from './pages/BrowseItems';
import MyRequests from './pages/MyRequests';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Item management routes for Admin/Staff */}
            <Route
              path="/items/add"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <AddItem />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/items/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <EditItem />
                </ProtectedRoute>
              }
            />
            
            {/* Placeholder routes for features to be implemented */}
            <Route
              path="/items"
              element={
                <ProtectedRoute>
                  <BrowseItems />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/items/new"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Report Item</h2>
                    <p className="text-gray-600">This page will allow users to report lost or found items</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            
            {/* Admin/Staff routes */}
            <Route
              path="/manage-items"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <ManageItems />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/manage-requests"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            
            {/* Admin only routes */}
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <a href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
