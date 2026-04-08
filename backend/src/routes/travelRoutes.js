const express = require('express');
const router = express.Router();
const {
  searchTravel,
  getTravelOptions,
  getSeatAvailability,
  getTravelOptionById,
} = require('../controllers/travelController');

// GET /api/travel/search?source=MAS&destination=CBE&type=train&date=2024-12-25
router.get('/search', searchTravel);

// GET /api/travel/options
router.get('/options', getTravelOptions);

// GET /api/travel/:id/seats
router.get('/:id/seats', getSeatAvailability);

// GET /api/travel/:id
router.get('/:id', getTravelOptionById);

module.exports = router;
