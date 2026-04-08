const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { parseNLPInput, getCitySuggestions } = require('../controllers/nlpController');
const validate = require('../middleware/validate');

// POST /api/nlp/parse
router.post(
  '/parse',
  [body('text').notEmpty().withMessage('உரை உள்ளீடு தேவை')],
  validate,
  parseNLPInput
);

// GET /api/nlp/cities?q=சென்
router.get('/cities', getCitySuggestions);

module.exports = router;
