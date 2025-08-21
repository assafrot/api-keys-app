'use client';

export default function Header() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center text-sm text-gray-500">
        <span>Pages</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Overview</span>
        <div className="ml-auto flex items-center">
          <div className="flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Operational
          </div>
        </div>
      </div>
    </div>
  );
}