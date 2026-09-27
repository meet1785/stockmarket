import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { startOrderEngine, stopOrderEngine } from '../../services/orderExecutionService';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Start the background order execution engine
  useEffect(() => {
    startOrderEngine();
    return () => stopOrderEngine();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-surface-0 text-white overflow-hidden">
      {/* Simulation Banner */}
      <div className="simulation-banner bg-yellow-500/20 text-yellow-300 text-xs font-semibold py-1 px-4 text-center z-50">
        EDUCATIONAL PAPER TRADING — Simulated, no real money. No real orders are placed.
      </div>

      {/* Top Navigation */}
      <TopBar onMenuToggle={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 relative">
          {children || <Outlet />}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
