import { useTickets } from '../context/TicketContext';
import { Layers, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const StatsStrip = () => {
  const { stats } = useTickets();

  if (!stats) return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard 
        title="Open" 
        value={stats.statusCounts.open} 
        icon={Layers} 
        colorClass="bg-blue-500 text-blue-500" 
      />
      <StatCard 
        title="In Progress" 
        value={stats.statusCounts.in_progress} 
        icon={Clock} 
        colorClass="bg-yellow-500 text-yellow-500" 
      />
      <StatCard 
        title="Resolved" 
        value={stats.statusCounts.resolved} 
        icon={CheckCircle} 
        colorClass="bg-green-500 text-green-500" 
      />
      <StatCard 
        title="Closed" 
        value={stats.statusCounts.closed} 
        icon={XCircle} 
        colorClass="bg-gray-500 text-gray-500" 
      />
      <StatCard 
        title="Breached (Open)" 
        value={stats.breachedOpenTickets} 
        icon={AlertTriangle} 
        colorClass="bg-red-500 text-red-500" 
      />
    </div>
  );
};

export default StatsStrip;
