import { useState, useEffect, useRef } from 'react';
import { nlpAPI } from '../services/api';

export function CityAutocomplete({ label, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const fetchCities = async () => {
      if (query.length > 1) {
        try {
          const res = await nlpAPI.getCities(query);
          // Expecting an array of city objects [{name: 'சென்னை', code: 'MAS'}]
          setSuggestions(res.data || []);
          setIsOpen(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
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
        onFocus={() => query.length > 1 && setIsOpen(true)}
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-input shadow-lg max-h-60 overflow-auto">
          {suggestions.map((city, idx) => (
            <li
              key={idx}
              className="px-4 py-3 hover:bg-brandLightBlue cursor-pointer transition text-brandDarkText border-b last:border-b-0"
              onClick={() => handleSelect(city)}
            >
              <span className="font-semibold">{city.name}</span>
              {city.code && <span className="ml-2 text-brandMutedText text-xs">({city.code})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
