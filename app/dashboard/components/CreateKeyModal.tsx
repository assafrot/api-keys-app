'use client';

import { useState, useEffect } from 'react';

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, limit: number) => Promise<void>;
  validateKeyName: (name: string) => string;
}

export default function CreateKeyModal({ isOpen, onClose, onCreate, validateKeyName }: CreateKeyModalProps) {
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyLimit, setNewKeyLimit] = useState('1000');
  const [nameError, setNameError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleClose = () => {
    setNewKeyName('');
    setNewKeyLimit('1000');
    setNameError('');
    setIsCreating(false);
    onClose();
  };

  const handleValidateKeyName = (name: string) => {
    const error = validateKeyName(name);
    setNameError(error);
    return !error;
  };

  const handleCreate = async () => {
    if (!handleValidateKeyName(newKeyName)) return;
    
    try {
      setIsCreating(true);
      await onCreate(newKeyName, parseInt(newKeyLimit) || 1000);
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setNameError(error.message);
      } else {
        setNameError('An unexpected error occurred');
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create a new API key</h2>
        <p className="text-gray-600 mb-6">Enter a name and limit for the new API key.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Name — <span className="text-gray-500 font-normal">A unique name to identify this key</span>
            </label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => {
                setNewKeyName(e.target.value);
                if (nameError) {
                  handleValidateKeyName(e.target.value);
                }
              }}
              onBlur={() => handleValidateKeyName(newKeyName)}
              onKeyDown={(e) => e.key === 'Enter' && newKeyName.trim() && !nameError && handleCreate()}
              placeholder="Key Name"
              className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                nameError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              autoFocus
              disabled={isCreating}
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600">{nameError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Limit monthly usage*
            </label>
            <input
              type="number"
              value={newKeyLimit}
              onChange={(e) => setNewKeyLimit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isCreating}
            />
          </div>
          
          <p className="text-xs text-gray-500">
            * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
          </p>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!newKeyName.trim() || !!nameError || isCreating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}