import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import InstallBanner from './InstallBanner';

function Layout({ children, isOnline }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <Header 
        isOnline={isOnline} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
      />
      <InstallBanner />
      <div className="layout-wrapper">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <main className="main-content">
          {!isOnline && (
            <div className="offline-banner">
              <span>⚠️ You are offline - some features may be limited</span>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
