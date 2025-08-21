'use client';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ show, message, type, onClose }: ToastProps) {
  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className={`rounded-lg p-4 shadow-lg border backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-green-50/90 border-green-200 text-green-800' 
          : 'bg-red-50/90 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-5 h-5 ${
            type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {type === 'success' ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <p className="font-medium text-sm">{message}</p>
          <button
            onClick={onClose}
            className={`ml-2 text-xs opacity-70 hover:opacity-100 ${
              type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}