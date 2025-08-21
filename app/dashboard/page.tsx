'use client';

import { useState, useEffect } from 'react';
import { useApiKeys } from './hooks/useApiKeys';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlanCard from './components/PlanCard';
import CreateKeyModal from './components/CreateKeyModal';
import ApiKeysTable from './components/ApiKeysTable';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';

export default function Dashboard() {
  const {
    apiKeys,
    loading,
    error,
    setError,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    validateKeyName,
    totalUsage
  } = useApiKeys();

  // UI state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; keyId: string; keyName: string }>({
    show: false,
    keyId: '',
    keyName: ''
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Auto-hide toast on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toast.show) {
        setToast({ show: false, message: '', type: 'success' });
      }
    };
    
    if (toast.show) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [toast.show]);

  const handleCreateKey = async (name: string, limit: number) => {
    try {
      await createApiKey(name, limit);
      showToast('API key created successfully!', 'success');
    } catch (error) {
      throw error; // Let the modal handle the error display
    }
  };

  const handleUpdateKey = async (id: string, updates: any) => {
    try {
      await updateApiKey(id, updates);
      showToast('API key updated successfully!', 'success');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        } else {
        setError('An unexpected error occurred while updating the API key.');
      }
      throw error;
    }
  };

  const handleDeleteKey = (id: string, name: string) => {
    setDeleteConfirm({ show: true, keyId: id, keyName: name });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.keyId) {
      try {
        await deleteApiKey(deleteConfirm.keyId);
        showToast('API key deleted successfully!', 'success');
        setDeleteConfirm({ show: false, keyId: '', keyName: '' });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred while deleting the API key.');
        }
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('API key copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy API key', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Main Content */}
        <div className="p-6">
          <PlanCard totalUsage={totalUsage} loading={loading} />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* API Keys Section */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">API Keys</h2>
              <p className="text-gray-600">
                The key is used to authenticate your requests to the <span className="text-blue-600 underline cursor-pointer">Research API</span>. To learn more, see the <span className="text-blue-600 underline cursor-pointer">documentation page</span>.
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Key
            </button>
          </div>

          <ApiKeysTable
            apiKeys={apiKeys}
            loading={loading}
            onUpdate={handleUpdateKey}
            onDelete={handleDeleteKey}
            onCopy={copyToClipboard}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateKeyModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={handleCreateKey}
        validateKeyName={validateKeyName}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.show}
        keyName={deleteConfirm.keyName}
        onClose={() => setDeleteConfirm({ show: false, keyId: '', keyName: '' })}
        onConfirm={confirmDelete}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />
    </div>
  );
} 