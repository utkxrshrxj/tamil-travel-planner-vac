import { useState, useEffect, useRef } from 'react';
import { nlpAPI } from '../services/api';

const defaultCities = [
  { name: 'சென்னை', train: 'MAS', flight: 'MAA' },
  { name: 'மதுரை', train: 'MDU', flight: 'IXM' },
  { name: 'கோயம்புத்தூர்', train: 'CBE', flight: 'CJB' },
  { name: 'திருச்சிராப்பள்ளி', train: 'TPJ', flight: 'TRZ' },
  { name: 'சேலம்', train: 'SA', flight: 'SXV' },
  { name: 'திருநெல்வேலி', train: 'TEN', flight: 'TCR' },
  { name: 'பெங்களூரு', train: 'SBC', flight: 'BLR' },
  { name: 'ஹைதராபாத்', train: 'HYB', flight: 'HYD' },
  { name: 'மும்பை', train: 'CSMT', flight: 'BOM' },
  { name: 'டெல்லி', train: 'NDLS', flight: 'DEL' },
  { name: 'கொல்கத்தா', train: 'HWH', flight: 'CCU' }
];

export function CityAutocomplete({ label, value, onChange, placeholder, travelType }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState(defaultCities);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const fetchCities = async () => {
      if (query.trim().length > 1) {
        try {
          const res = await nlpAPI.getCities(query);
          // Expecting an array of city objects [{name: 'சென்னை', code: 'MAS'}]
          setSuggestions(res.data || []);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions(defaultCities);
      }
    };

    const debounce = setTimeout(fetchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (city) => {
    setQuery(city.name);
    onChange(city.name); // or city.code depending on your needs
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && <label className="block text-brandMutedText text-sm font-semibold mb-1">{label}</label>}
      <input
        type="text"
        className="input-field"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 glassmorphism border border-white/60 rounded-input shadow-lg max-h-60 overflow-auto">
          {suggestions.map((city, idx) => (
            <li
              key={idx}
              className="px-4 py-3 hover:bg-white/40 cursor-pointer transition text-brandDarkText border-b border-white/20 last:border-b-0"
              onClick={() => handleSelect(city)}
            >
              <span className="font-semibold">{city.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
