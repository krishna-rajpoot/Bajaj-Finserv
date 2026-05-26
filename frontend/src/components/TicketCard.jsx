import { useDraggable } from '@dnd-kit/core';
import { AlertCircle, Clock } from 'lucide-react';

const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

const formatAge = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const TicketCard = ({ ticket }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: { ticket },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-lg p-4 shadow-sm border cursor-grab hover:shadow-md transition-shadow relative ${
        isDragging ? 'opacity-50 z-50' : 'opacity-100'
      } ${ticket.slaBreached ? 'border-red-400 border-l-4' : 'border-gray-200'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-800 font-semibold text-sm line-clamp-2 pr-2">
          {ticket.subject}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded border font-medium uppercase tracking-wider whitespace-nowrap ${
            priorityColors[ticket.priority]
          }`}
        >
          {ticket.priority}
        </span>
      </div>

      <div className="flex justify-between items-end mt-4">
        <div className="flex items-center text-gray-500 text-xs font-medium">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {formatAge(ticket.ageMinutes)}
        </div>
        
        {ticket.slaBreached && (
          <div className="flex items-center text-red-500 text-xs font-bold" title="SLA Breached">
            <AlertCircle className="w-4 h-4 mr-1" />
            SLA Breached
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
