const express = require('express');
const router = express.Router();
const {
  getTicketById,
  getTicketByPNR,
  getMyTickets,
  downloadTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

// GET /api/tickets/my-tickets
router.get('/my-tickets', protect, getMyTickets);

// GET /api/tickets/pnr/:pnrNumber  (public PNR check)
router.get('/pnr/:pnrNumber', getTicketByPNR);

// GET /api/tickets/:ticketId
router.get('/:ticketId', protect, getTicketById);

// GET /api/tickets/:ticketId/download
router.get('/:ticketId/download', protect, downloadTicket);

module.exports = router;
