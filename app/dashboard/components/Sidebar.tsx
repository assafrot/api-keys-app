'use client';

import Link from 'next/link';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
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
        <div 
          className={`flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Overview" : ""}
        >
          <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
          </svg>
          {!isCollapsed && "Overview"}
        </div>
        
        <div 
          className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "API Keys" : ""}
        >
          <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
          {!isCollapsed && "API Keys"}
        </div>
        
        <div 
          className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Analytics" : ""}
        >
          <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {!isCollapsed && "Analytics"}
        </div>
        
        <div 
          className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Settings" : ""}
        >
          <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {!isCollapsed && "Settings"}
        </div>
        
        <div 
          className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Documentation" : ""}
        >
          <svg className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {!isCollapsed && "Documentation"}
        </div>
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