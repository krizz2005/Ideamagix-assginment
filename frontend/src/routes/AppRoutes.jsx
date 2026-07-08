import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserList from '../pages/Users/UserList';
import LeadList from '../pages/Leads/LeadList';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../components/Layout/AdminLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['Super Admin', 'Sub-Admin', 'Support Agent']}>
          <AdminLayout><Dashboard /></AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/leads" element={
        <ProtectedRoute allowedRoles={['Super Admin', 'Sub-Admin', 'Support Agent']}>
          <AdminLayout><LeadList /></AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['Super Admin']}>
          <AdminLayout><UserList /></AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;