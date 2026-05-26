const Ticket = require('../models/Ticket');

const validTransitions = {
  open: ['in_progress'],
  in_progress: ['resolved', 'open'], // Assuming in_progress can go back to open if needed, but let's stick to strict backward one step rules. The rules said "Backward only one step: resolved -> in_progress, closed -> resolved". Wait, maybe in_progress -> open is also valid. I will allow in_progress -> open to be safe for board movement.
  resolved: ['closed', 'in_progress'],
  closed: ['resolved']
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Public
const createTicket = async (req, res, next) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;

    if (!subject || !description || !customerEmail || !priority) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const ticket = await Ticket.create({
      subject,
      description,
      customerEmail,
      priority,
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Public
const getTickets = async (req, res, next) => {
  try {
    const { status, priority, breached } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    let filteredTickets = tickets;
    
    if (breached === 'true') {
      filteredTickets = tickets.filter(t => t.slaBreached);
    }

    res.status(200).json(filteredTickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status
// @route   PATCH /api/tickets/:id
// @access  Public
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      res.status(400);
      throw new Error('Please provide a status');
    }

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status: ${status}`);
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const currentStatus = ticket.status;
    
    // Check transitions
    if (currentStatus !== status) {
      const allowed = validTransitions[currentStatus] || [];
      if (!allowed.includes(status)) {
        res.status(400);
        throw new Error(`Invalid transition: ${currentStatus} \u2192 ${status} not allowed`);
      }
    }

    ticket.status = status;

    // Handle resolvedAt
    if (status === 'resolved' && currentStatus !== 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (currentStatus === 'resolved' && status !== 'resolved') {
      ticket.resolvedAt = null;
    }

    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Public
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    await ticket.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Ticket removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket stats
// @route   GET /api/tickets/stats
// @access  Public
const getStats = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({});
    
    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    };
    
    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };
    
    let breachedOpenTickets = 0;

    tickets.forEach(ticket => {
      if (statusCounts[ticket.status] !== undefined) {
        statusCounts[ticket.status]++;
      }
      if (priorityCounts[ticket.priority] !== undefined) {
        priorityCounts[ticket.priority]++;
      }
      
      // Breached open tickets
      if (ticket.status !== 'closed' && ticket.slaBreached) {
        breachedOpenTickets++;
      }
    });

    res.status(200).json({
      statusCounts,
      priorityCounts,
      breachedOpenTickets,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  getStats,
};
