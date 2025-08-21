'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { ApiKey } from '../../../lib/supabase';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // For demo purposes, we'll use a hardcoded user ID
  // In a real app, this would come from authentication
  const userId = 'demo-user-123';

  // Load API keys from Supabase on component mount and set up real-time subscription
  useEffect(() => {
    loadApiKeys();

    // Set up real-time subscription to listen for changes
    const subscription = supabase
      .channel('api-keys-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'api_keys',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('INSERT event detected:', payload);
          
          const newKey: ApiKey = {
            id: payload.new.id,
            name: payload.new.name,
            key: payload.new.key,
            created_at: payload.new.created_at,
            last_used: payload.new.last_used,
            is_active: payload.new.is_active,
            usage: payload.new.usage,
            monthly_limit: payload.new.monthly_limit,
            user_id: payload.new.user_id
          };
          
          setApiKeys(prevKeys => {
            const exists = prevKeys.some(key => key.id === newKey.id);
            if (!exists) {
              console.log('Adding new key from real-time:', newKey.name, 'ID:', newKey.id);
              return [newKey, ...prevKeys];
            }
            console.log('Skipping duplicate key from real-time:', newKey.name, 'ID:', newKey.id);
            return prevKeys;
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'api_keys',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('UPDATE event detected:', payload);
          
          const updatedKey: ApiKey = {
            id: payload.new.id,
            name: payload.new.name,
            key: payload.new.key,
            created_at: payload.new.created_at,
            last_used: payload.new.last_used,
            is_active: payload.new.is_active,
            usage: payload.new.usage,
            monthly_limit: payload.new.monthly_limit,
            user_id: payload.new.user_id
          };
          
          console.log('Updating key from real-time:', updatedKey.name);
          setApiKeys(prevKeys => 
            prevKeys.map(key => 
              key.id === updatedKey.id ? updatedKey : key
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'api_keys'
          // No filter for DELETE - we'll check user_id in the handler
        },
        (payload) => {
          console.log('DELETE event detected:', payload);
          
          // Check if this delete is for our user
          if (payload.old && payload.old.user_id === userId) {
            console.log('Deleting key from real-time:', payload.old.id);
            setApiKeys(prevKeys => {
              const beforeCount = prevKeys.length;
              const filtered = prevKeys.filter(key => key.id !== payload.old.id);
              const afterCount = filtered.length;
              console.log(`Real-time DELETE: ${beforeCount} -> ${afterCount} keys. Deleted ID: ${payload.old.id}`);
              
              // Log all remaining key IDs for debugging
              console.log('Remaining key IDs:', filtered.map(k => k.id));
              return filtered;
            });
          } else {
            console.log('DELETE event not for our user, ignoring');
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: supabaseError } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Error loading API keys:', supabaseError);
        setError('Failed to load API keys');
        return;
      }

      // Convert Supabase data format to our component format
      const formattedKeys: ApiKey[] = (data || []).map(key => ({
        id: key.id,
        name: key.name,
        key: key.key,
        created_at: key.created_at,
        last_used: key.last_used,
        is_active: key.is_active,
        usage: key.usage,
        monthly_limit: key.monthly_limit,
        user_id: key.user_id
      }));

      setApiKeys(formattedKeys);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    return 'rot-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createApiKey = async (name: string, monthlyLimit: number) => {
    try {
      setError('');
      const newKey = {
        name: name.trim(),
        key: generateApiKey(),
        is_active: true,
        usage: 0,
        monthly_limit: monthlyLimit,
        user_id: userId,
      };

      const { data, error: supabaseError } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (supabaseError) {
        console.error('Error creating API key:', supabaseError);
        
        // Handle duplicate name error specifically
        if (supabaseError.code === '23505' && supabaseError.message.includes('name')) {
          throw new Error('A key with this name already exists');
        }
        
        // Handle other errors with user-friendly messages
        if (supabaseError.code === '23505') {
          throw new Error('This API key configuration already exists');
        } else if (supabaseError.code === '42501') {
          throw new Error('You do not have permission to create API keys');
        } else {
          throw new Error('Failed to create API key. Please try again.');
        }
      }

      // Add to local state immediately (real-time will handle sync across tabs)
      const formattedKey: ApiKey = {
        id: data.id,
        name: data.name,
        key: data.key,
        created_at: data.created_at,
        last_used: data.last_used,
        is_active: data.is_active,
        usage: data.usage,
        monthly_limit: data.monthly_limit,
        user_id: data.user_id
      };

      setApiKeys(prevKeys => [formattedKey, ...prevKeys]);
      return formattedKey;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  const updateApiKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      setError('');
      
      const { error: supabaseError } = await supabase
        .from('api_keys')
        .update({
          name: updates.name,
          is_active: updates.is_active,
          usage: updates.usage,
          monthly_limit: updates.monthly_limit,
        })
        .eq('id', id)
        .eq('user_id', userId);

      if (supabaseError) {
        console.error('Error updating API key:', supabaseError);
        
        // Handle duplicate name error specifically
        if (supabaseError.code === '23505' && supabaseError.message.includes('name')) {
          throw new Error('Another API key with this name already exists');
        }
        
        // Handle other errors with user-friendly messages
        if (supabaseError.code === '42501') {
          throw new Error('You do not have permission to update this API key');
        } else {
          throw new Error('Failed to update API key. Please try again.');
        }
      }

      // Update local state immediately (real-time will handle sync across tabs)
      setApiKeys(prevKeys => 
        prevKeys.map(key => 
          key.id === id ? { ...key, ...updates } : key
        )
      );
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      setError('');
      console.log('Attempting to delete API key with ID:', id);
      
      const { error: supabaseError } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (supabaseError) {
        console.error('Error deleting API key:', supabaseError);
        
        // Handle specific error cases
        if (supabaseError.code === '42501') {
          throw new Error('You do not have permission to delete this API key');
        } else if (supabaseError.code === '23503') {
          throw new Error('Cannot delete this API key as it is being used by other services');
        } else {
          throw new Error('Failed to delete API key. Please try again.');
        }
      }

      console.log('Successfully deleted API key from database:', id);
      
      // Update local state immediately (real-time will handle sync across tabs)
      setApiKeys(prevKeys => {
        const filtered = prevKeys.filter(key => key.id !== id);
        console.log('Updated local state after delete. Keys before:', prevKeys.length, 'Keys after:', filtered.length);
        return filtered;
      });
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  const toggleApiKeyStatus = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (key) {
      updateApiKey(id, { is_active: !key.is_active });
    }
  };

  const validateKeyName = (name: string) => {
    if (!name.trim()) {
      return 'Key name is required';
    }
    
    const existingKey = apiKeys.find(key => 
      key.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingKey) {
      return 'A key with this name already exists';
    }
    
    return '';
  };

  const totalUsage = apiKeys.reduce((sum, key) => sum + key.usage, 0);

  return {
    apiKeys,
    loading,
    error,
    setError,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleApiKeyStatus,
    validateKeyName,
    totalUsage,
    userId
  };
}