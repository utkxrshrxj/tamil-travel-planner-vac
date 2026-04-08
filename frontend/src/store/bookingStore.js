import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  selectedOption: null,
  travelClass: null,
  passengers: [{ id: 1, name: '', age: '', gender: 'ஆண்', idType: 'ஆதார்', idNumber: '', seat: '' }],
  foodPreference: 'உணவு வேண்டாம்', // சைவம், அசைவம்
  luggageAllowance: '15 கிலோ',
  seatSelections: [],
  fareBreakdown: {
    baseFare: 0,
    tax: 0,
    fee: 30,
    total: 0
  },
  currentStep: 1, // 1: Passengers, 2: Food & Luggage, 3: Confirmation
  setStep: (step) => set({ currentStep: step }),
  setBookingData: (data) => set((state) => ({ ...state, ...data })),
  resetBooking: () => set({
    selectedOption: null,
    travelClass: null,
    passengers: [{ id: 1, name: '', age: '', gender: 'ஆண்', idType: 'ஆதார்', idNumber: '', seat: '' }],
    foodPreference: 'உணவு வேண்டாம்',
    luggageAllowance: '15 கிலோ',
    seatSelections: [],
    fareBreakdown: { baseFare: 0, tax: 0, fee: 30, total: 0 },
    currentStep: 1
  })
}));
