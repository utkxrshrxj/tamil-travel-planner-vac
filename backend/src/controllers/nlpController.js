// Tamil NLP Input Processor
// Extracts journey intent from Tamil text/voice input

// Tamil keyword maps
const TRAVEL_TYPES = {
  train: ['ரயில்', 'train', 'ரெயில்', 'express', 'எக்ஸ்பிரஸ்', 'மெயில்'],
  bus: ['பஸ்', 'bus', 'பேருந்து', 'ஓமினி', 'omni'],
  flight: ['விமானம்', 'flight', 'ஏர்', 'air', 'fly', 'plane'],
};

const CITY_MAP = {
  சென்னை: 'MAS', madras: 'MAS', chennai: 'MAS',
  கோவை: 'CBE', coimbatore: 'CBE', kovai: 'CBE',
  மதுரை: 'MDU', madurai: 'MDU',
  திருச்சி: 'TPJ', trichy: 'TPJ',
  சேலம்: 'SA', salem: 'SA',
  வேலூர்: 'VLR', vellore: 'VLR',
  திருநெல்வேலி: 'TEN', tirunelveli: 'TEN',
  நாகர்கோவில்: 'NCJ', nagercoil: 'NCJ',
  தஞ்சாவூர்: 'TJ', thanjavur: 'TJ',
  ஈரோடு: 'ED', erode: 'ED',
  புதுச்சேரி: 'PDY', pondicherry: 'PDY',
  ஓட்டி: 'UAM', ooty: 'UAM',
};

// Direction markers in Tamil
const FROM_MARKERS = ['இருந்து', 'லிருந்து', 'from', 'புறப்பட', 'start'];
const TO_MARKERS = ['வரை', 'க்கு', 'to', 'செல்ல', 'போக', 'போகணும்', 'போகனும்'];
const DATE_PATTERNS = {
  today: ['இன்று', 'today', 'இன்னைக்கு'],
  tomorrow: ['நாளை', 'tomorrow', 'நாளைக்கு'],
  dayAfter: ['நாளை மறுநாள்', 'day after tomorrow'],
};

const parseTamilInput = (text) => {
  const result = {
    source: null,
    destination: null,
    travelType: null,
    date: null,
    passengers: 1,
    confidence: 'low',
    rawInput: text,
  };

  const lower = text.toLowerCase();
  const words = lower.split(/[\s,]+/);

  // 1. Detect travel type
  for (const [type, keywords] of Object.entries(TRAVEL_TYPES)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      result.travelType = type;
      break;
    }
  }

  // 2. Detect cities
  const foundCities = [];
  for (const [name, code] of Object.entries(CITY_MAP)) {
    if (lower.includes(name.toLowerCase())) {
      foundCities.push({ name, code, position: lower.indexOf(name.toLowerCase()) });
    }
  }
  foundCities.sort((a, b) => a.position - b.position);

  if (foundCities.length >= 2) {
    result.source = foundCities[0].code;
    result.destination = foundCities[1].code;
  } else if (foundCities.length === 1) {
    // Try to figure out direction from markers
    const pos = foundCities[0].position;
    const beforeCity = lower.substring(0, pos);
    const isSource = FROM_MARKERS.some((m) => beforeCity.includes(m));
    const isDest = TO_MARKERS.some((m) => beforeCity.includes(m));
    if (isSource) result.source = foundCities[0].code;
    else if (isDest) result.destination = foundCities[0].code;
    else result.source = foundCities[0].code; // default: first city is source
  }

  // 3. Detect date
  const today = new Date();
  for (const [key, keywords] of Object.entries(DATE_PATTERNS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      if (key === 'today') result.date = today.toISOString().split('T')[0];
      else if (key === 'tomorrow') {
        const d = new Date(today); d.setDate(d.getDate() + 1);
        result.date = d.toISOString().split('T')[0];
      } else if (key === 'dayAfter') {
        const d = new Date(today); d.setDate(d.getDate() + 2);
        result.date = d.toISOString().split('T')[0];
      }
      break;
    }
  }

  // Look for explicit dates (e.g. "15/06" or "June 15" or "15 ஜூன்")
  const dateMatch = lower.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?/);
  if (dateMatch && !result.date) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3] || today.getFullYear();
    result.date = `${year}-${month}-${day}`;
  }

  // 4. Detect passenger count
  const passMatch = lower.match(/(\d+)\s*(பேர்|persons?|people|passengers?|பயணி)/);
  if (passMatch) result.passengers = parseInt(passMatch[1], 10);

  // 5. Assign confidence
  let score = 0;
  if (result.source) score++;
  if (result.destination) score++;
  if (result.travelType) score++;
  if (result.date) score++;
  result.confidence = score >= 3 ? 'high' : score >= 2 ? 'medium' : 'low';

  return result;
};

// @desc    Process Tamil NLP input and return structured journey data
// @route   POST /api/nlp/parse
// @access  Public
const parseNLPInput = async (req, res, next) => {
  try {
    const { text, language } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'உரை உள்ளீடு தேவை', // Text input required
      });
    }

    const parsed = parseTamilInput(text.trim());

    const suggestions = [];
    if (!parsed.source) suggestions.push('புறப்படும் இடம் குறிப்பிடவும்'); // Specify departure city
    if (!parsed.destination) suggestions.push('செல்லும் இடம் குறிப்பிடவும்'); // Specify destination
    if (!parsed.travelType) suggestions.push('பயண வகை (ரயில்/பஸ்/விமானம்) குறிப்பிடவும்'); // Specify travel type
    if (!parsed.date) suggestions.push('பயண தேதி குறிப்பிடவும்'); // Specify travel date

    res.status(200).json({
      success: true,
      parsed,
      suggestions,
      searchUrl: parsed.source && parsed.destination
        ? `/api/travel/search?source=${parsed.source}&destination=${parsed.destination}${parsed.travelType ? `&type=${parsed.travelType}` : ''}${parsed.date ? `&date=${parsed.date}` : ''}`
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tamil NLP suggestions for autocomplete
// @route   GET /api/nlp/cities
// @access  Public
const getCitySuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    const lower = q.toLowerCase();
    const matches = Object.entries(CITY_MAP)
      .filter(([name]) => name.toLowerCase().includes(lower))
      .map(([name, code]) => ({ name, code }))
      .slice(0, 8);

    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
};

module.exports = { parseNLPInput, getCitySuggestions };
