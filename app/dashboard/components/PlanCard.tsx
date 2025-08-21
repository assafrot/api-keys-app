'use client';

interface PlanCardProps {
  totalUsage: number;
  loading: boolean;
}

export default function PlanCard({ totalUsage, loading }: PlanCardProps) {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-xl p-6 text-white mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-sm uppercase tracking-wide opacity-90 mb-2">CURRENT PLAN</div>
          <h1 className="text-3xl font-bold">Researcher</h1>
        </div>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm text-sm font-medium transition-colors">
          📋 Manage Plan
        </button>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          API Limit
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </h2>
        <div className="text-xl font-bold mb-2">{totalUsage} / 1,000 Requests</div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(totalUsage / 1000) * 100}%` }}
          ></div>
        </div>
        {loading && <div className="text-sm mt-2 opacity-80">Loading...</div>}
      </div>
    </div>
  );
}