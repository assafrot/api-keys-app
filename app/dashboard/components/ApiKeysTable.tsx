'use client';

import { useState } from 'react';
import type { ApiKey } from '../../../lib/supabase';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  loading: boolean;
  onUpdate: (id: string, updates: Partial<ApiKey>) => Promise<void>;
  onDelete: (id: string, name: string) => void;
  onCopy: (text: string) => void;
}

export default function ApiKeysTable({ apiKeys, loading, onUpdate, onDelete, onCopy }: ApiKeysTableProps) {
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 5) + '*'.repeat(key.length - 5);
  };

  const handleUpdate = async (id: string, updates: Partial<ApiKey>) => {
    try {
      await onUpdate(id, updates);
      setEditingKey(null);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error updating key:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading API keys...</p>
        </div>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-500">
            No API keys created yet. Create your first API key to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                USAGE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KEY
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                OPTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiKeys.map((apiKey) => (
              <tr key={apiKey.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingKey?.id === apiKey.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingKey?.name || ''}
                        onChange={(e) => setEditingKey({ ...editingKey!, name: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdate(apiKey.id, { name: editingKey?.name || '' });
                          } else if (e.key === 'Escape') {
                            setEditingKey(null);
                          }
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdate(apiKey.id, { name: editingKey?.name || '' })}
                        disabled={!editingKey?.name?.trim()}
                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingKey(null)}
                        className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{apiKey.usage} / {apiKey.monthly_limit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">
                    {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingKey?.id !== apiKey.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={showKey[apiKey.id] ? "Hide key" : "Show key"}
                      >
                        {showKey[apiKey.id] ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L9 9m.878.878l4.242 4.242M21 12c0 .764-.077 1.508-.227 2.227" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => onCopy(apiKey.key)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy key"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEditingKey({ ...apiKey })}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit key"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(apiKey.id, apiKey.name)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete key"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}