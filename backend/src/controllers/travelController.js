const TravelOption = require('../models/TravelOption');
const externalApiService = require('../services/externalApiService');

// Tamil city name mappings
const CITY_ALIASES = {
  'சென்னை': 'MAS', 'madras': 'MAS', 'chennai': 'MAS',
  'கோவை': 'CBE', 'coimbatore': 'CBE', 'kovai': 'CBE',
  'மதுரை': 'MDU', 'madurai': 'MDU',
  'திருச்சி': 'TPJ', 'trichy': 'TPJ', 'tiruchirappalli': 'TPJ',
  'சேலம்': 'SA', 'salem': 'SA',
  'வேலூர்': 'VLR', 'vellore': 'VLR',
  'திருநெல்வேலி': 'TEN', 'tirunelveli': 'TEN',
  'நாகர்கோவில்': 'NCJ', 'nagercoil': 'NCJ',
  'தஞ்சாவூர்': 'TJ', 'thanjavur': 'TJ',
  'ஈரோடு': 'ED', 'erode': 'ED',
  'தூத்துக்குடி': 'TUT', 'tuticorin': 'TUT',
  'கும்பகோணம்': 'KMU', 'kumbakonam': 'KMU',
  'பாளையங்கோட்டை': 'PGT', 'palayamkottai': 'PGT',
  'விழுப்புரம்': 'VM', 'villupuram': 'VM',
  'கடலூர்': 'CDL', 'cuddalore': 'CDL',
  'ஓட்டி': 'UAM', 'ooty': 'UAM',
  'முண்டு': 'MDU',
  'டெல்லி': 'DEL', 'delhi': 'DEL', 'tilli': 'DEL', 'டெெல்லி': 'DEL',
  'பெங்களூர்': 'SBC', 'bangalore': 'SBC', 'பெங்களூரு': 'SBC',
  'मुंबई': 'BOM', 'mumbai': 'BOM', 'மும்பை': 'BOM',
  'புதுச்சேரி': 'PDY', 'pondicherry': 'PDY', 'puducherry': 'PDY',
};

const resolveCity = (input) => {
  if (!input) return null;
  const cleaned = input.trim().toLowerCase();
  return CITY_ALIASES[cleaned] || input.toUpperCase();
};

// @desc    Search travel options
// @route   GET /api/travel/search
// @access  Public
const searchTravel = async (req, res, next) => {
  try {
    let { source, destination, type, date, foodPreference, passengers = 1 } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'புறப்படும் இடம் மற்றும் செல்லும் இடம் கொடுக்கவும்', // Provide source and destination
      });
    }

    const sourceCode = resolveCity(source);
    const destCode = resolveCity(destination);

    const query = {
      source: sourceCode,
      destination: destCode,
      isActive: true,
    };

    if (type && ['train', 'bus', 'flight'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by food preference
    if (foodPreference === 'veg') {
      query['foodService.vegOption'] = true;
    } else if (foodPreference === 'non_veg') {
      query['foodService.nonVegOption'] = true;
    }

    // Filter by day of week if date given
    if (date) {
      const travelDate = new Date(date);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[travelDate.getDay()];
      query.$or = [{ days: { $exists: false } }, { days: { $size: 0 } }, { days: dayName }];
    }

    // --- Real-time API integration ---
    let externalOptions = [];
    if (type === 'flight') {
      const flightResults = await externalApiService.searchFlights(sourceCode, destCode, date);
      externalOptions = [...externalOptions, ...flightResults];
    } else if (type === 'train') {
      const trainResults = await externalApiService.searchTrains(sourceCode, destCode);
      externalOptions = [...externalOptions, ...trainResults];
    } else if (!type || type === 'all' || type === 'any') {
      // Fetch both if no type specified
      const [flightResults, trainResults] = await Promise.all([
        externalApiService.searchFlights(sourceCode, destCode, date),
        externalApiService.searchTrains(sourceCode, destCode)
      ]);
      externalOptions = [...flightResults, ...trainResults];
    }

    const localOptions = await TravelOption.find(query).sort({ 'pricing.0.price': 1 }).lean();
    
    // Merge local and external (Prefer real-time if same train/flight, but for now just combine)
    const options = [...externalOptions, ...localOptions];

    if (options.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'இந்த பாதையில் பயண வசதிகள் இல்லை', // No travel options on this route
        data: [],
      });
    }

    // Filter options that have seats for requested passengers
    const passengerCount = parseInt(passengers, 10) || 1;
    const availableOptions = options.filter((opt) =>
      opt.pricing.some((p) => p.availableSeats >= passengerCount)
    );

    res.status(200).json({
      success: true,
      count: availableOptions.length,
      searchParams: {
        source: sourceCode,
        destination: destCode,
        type: type || 'all',
        date: date || 'any',
        passengers: passengerCount,
      },
      data: availableOptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all travel options (with optional filters)
// @route   GET /api/travel/options
// @access  Public
const getTravelOptions = async (req, res, next) => {
  try {
    const { type, source, destination } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    if (source) query.source = resolveCity(source);
    if (destination) query.destination = resolveCity(destination);

    const options = await TravelOption.find(query);
    res.status(200).json({ success: true, count: options.length, data: options });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seat availability for a specific travel option
// @route   GET /api/travel/:id/seats
// @access  Public
const getSeatAvailability = async (req, res, next) => {
  try {
    const option = await TravelOption.findById(req.params.id);

    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'பயண விவரம் கிடைக்கவில்லை', // Travel option not found
      });
    }

    const seatMap = option.pricing.map((cls) => ({
      class: cls.class,
      totalSeats: cls.totalSeats,
      availableSeats: cls.availableSeats,
      bookedSeats: cls.totalSeats - cls.availableSeats,
      price: cls.price,
      availability:
        cls.availableSeats === 0
          ? 'full'
          : cls.availableSeats <= 10
          ? 'few_left'
          : 'available',
    }));

    res.status(200).json({
      success: true,
      travelOptionId: option._id,
      type: option.type,
      route: `${option.sourceName} → ${option.destinationName}`,
      seatAvailability: seatMap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single travel option by ID
// @route   GET /api/travel/:id
// @access  Public
const getTravelOptionById = async (req, res, next) => {
  try {
    const option = await TravelOption.findById(req.params.id);
    if (!option) {
      return res.status(404).json({ success: false, message: 'கிடைக்கவில்லை' });
    }
    res.status(200).json({ success: true, data: option });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchTravel, getTravelOptions, getSeatAvailability, getTravelOptionById };
