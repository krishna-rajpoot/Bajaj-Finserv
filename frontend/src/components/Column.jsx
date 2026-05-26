import { useDroppable } from '@dnd-kit/core';
import TicketCard from './TicketCard';

const Column = ({ id, title, tickets }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-xl p-4 flex flex-col min-h-[500px] border transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-bold text-gray-700">{title}</h2>
        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
          {tickets.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto scrollbar-hide pb-2">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default Column;
