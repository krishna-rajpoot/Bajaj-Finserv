import { DndContext, DragOverlay, closestCorners, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import Column from './Column';
import TicketCard from './TicketCard';
import { toast } from 'react-toastify';

const COLUMNS = [
  { id: 'open', title: 'Open' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'resolved', title: 'Resolved' },
  { id: 'closed', title: 'Closed' },
];

const validTransitions = {
  open: ['in_progress'],
  in_progress: ['resolved', 'open'],
  resolved: ['closed', 'in_progress'],
  closed: ['resolved']
};

const TicketBoard = () => {
  const { tickets, updateTicketStatus, loading } = useTickets();
  const [activeTicket, setActiveTicket] = useState(null);

  const getTicketsByStatus = (status) => {
    return tickets.filter((t) => t.status === status);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const ticket = active.data.current?.ticket;
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id;
    const newStatus = over.id;
    const ticket = active.data.current?.ticket;

    if (!ticket) return;

    const currentStatus = ticket.status;

    if (currentStatus === newStatus) return;

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      toast.error(`Invalid transition: ${currentStatus} \u2192 ${newStatus}`);
      return; // It will naturally snap back because state didn't change
    }

    await updateTicketStatus(ticketId, newStatus);
  };

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[500px] bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <DndContext 
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tickets={getTicketsByStatus(col.id)}
          />
        ))}
      </div>
      
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeTicket ? <TicketCard ticket={activeTicket} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TicketBoard;
