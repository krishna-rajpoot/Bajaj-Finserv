import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const TicketContext = createContext();

export const useTickets = () => useContext(TicketContext);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    breached: false,
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.breached) params.breached = filters.breached;

      const response = await api.get('/tickets', { params });
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/tickets/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      setTickets([response.data, ...tickets]);
      fetchStats();
      toast.success('Ticket created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
      return false;
    }
  };

  const updateTicketStatus = async (id, newStatus) => {
    // Optimistic update
    const previousTickets = [...tickets];
    const updatedTickets = tickets.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    );
    setTickets(updatedTickets);

    try {
      const response = await api.patch(`/tickets/${id}`, { status: newStatus });
      // Replace with actual response to get new dates etc
      setTickets(tickets.map(t => t.id === id ? response.data : t));
      fetchStats();
      toast.success('Ticket status updated');
      return true;
    } catch (error) {
      // Revert on failure
      setTickets(previousTickets);
      toast.error(error.response?.data?.message || 'Invalid transition');
      return false;
    }
  };

  const deleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTickets(tickets.filter(t => t.id !== id));
      fetchStats();
      toast.success('Ticket deleted');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const value = {
    tickets,
    stats,
    loading,
    filters,
    setFilters,
    fetchTickets,
    fetchStats,
    createTicket,
    updateTicketStatus,
    deleteTicket,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};
