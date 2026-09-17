import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminErrorBoundary from './AdminErrorBoundary';
import './admin.css';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="admin-shell">
      {/* Mobile Drawer Backdrop Overlay */}
      <div 
        className={`admin-sidebar-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Fixed Desktop / Mobile Drawer Sidebar */}
      <AdminSidebar 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        <AdminHeader 
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 min-w-0">
          <AdminErrorBoundary>
            <Outlet context={{ refreshTrigger, isRefreshing, setIsRefreshing }} />
          </AdminErrorBoundary>
        </main>

        <footer className="border-t border-gray-200 py-5 text-center text-xs font-mono text-gray-400 bg-white">
          UPSHIFT CONTROL CENTER · ADMIN WORKSPACE · PHASE 6
        </footer>
      </div>
    </div>
  );
}
