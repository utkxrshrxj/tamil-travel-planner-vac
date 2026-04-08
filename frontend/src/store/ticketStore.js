import { create } from 'zustand';

export const useTicketStore = create((set) => ({
  currentTicket: null,
  myTickets: [],
  myBookings: [],
  setCurrentTicket: (currentTicket) => set({ currentTicket }),
  setMyTickets: (myTickets) => set({ myTickets }),
  setMyBookings: (myBookings) => set({ myBookings }),
}));
