import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  source: '',
  destination: '',
  travelType: 'train', // train, bus, flight
  travelDate: '',
  passengers: 1,
  results: [],
  isLoading: false,
  filters: {
    priceRange: [0, 5000],
    types: ['train', 'bus', 'flight'],
    time: [],
    facilities: [],
    sort: 'price_asc'
  },
  setSearchParams: (params) => set((state) => ({ ...state, ...params })),
  setResults: (results) => set({ results }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
