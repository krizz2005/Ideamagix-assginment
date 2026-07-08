import React from 'react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-crm-bg min-h-screen text-crm-textMain">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;