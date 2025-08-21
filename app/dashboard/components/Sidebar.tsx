'use client';

import Link from 'next/link';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPage?: string;
}

export default function Sidebar({ isCollapsed, onToggle, currentPage = "overview" }: SidebarProps) {
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold text-gray-900">API Manager</h1>}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} 
            />
          </svg>
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link href="/dashboard">
          <div 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer ${isCollapsed ? 'justify-center' : ''} ${
              currentPage === 'overview' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title={isCollapsed ? "Overview" : ""}
          >
            <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
            </svg>
            {!isCollapsed && "Overview"}
          </div>
        </Link>
        
        <Link href="/playground">
          <div 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer ${isCollapsed ? 'justify-center' : ''} ${
              currentPage === 'playground' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title={isCollapsed ? "API Playground" : ""}
          >
            <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {!isCollapsed && "API Playground"}
          </div>
        </Link>
      </nav>
      
      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Back to Home" : ""}
        >
          <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {!isCollapsed && "Back to Home"}
        </Link>
      </div>
    </div>
  );
}