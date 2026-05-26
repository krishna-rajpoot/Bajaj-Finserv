const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  getStats,
} = require('../controllers/ticketController');

router.route('/').get(getTickets).post(createTicket);
router.route('/stats').get(getStats);
router.route('/:id').patch(updateTicketStatus).delete(deleteTicket);

module.exports = router;
