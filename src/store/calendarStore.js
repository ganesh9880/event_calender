import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { addDays, addMonths, addWeeks, isWithinInterval } from 'date-fns';

const useCalendarStore = create(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      selectedDate: new Date(),
      selectedEvent: null,
      conflicts: [],
      isEventModalOpen: false,
      modalMode: 'add',

      // Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedEvent: (event) => set({ selectedEvent: event }),
      setModalMode: (mode) => set({ modalMode: mode }),
      toggleEventModal: () => set((state) => ({ isEventModalOpen: !state.isEventModalOpen })),

      addEvent: (eventData) => {
        const newEvent = {
          ...eventData,
          id: uuidv4(),
          isRecurring: eventData.isRecurring,
        };

        const recurringEvents = [];
        if (eventData.isRecurring && eventData.recurrence) {
          const { type, interval = 1, daysOfWeek, endDate } = eventData.recurrence;
          let currentDate = new Date(eventData.startDate);
          const end = endDate || addMonths(currentDate, 3); // Default to 3 months if no end date

          while (currentDate <= end) {
            if (type === 'daily') {
              currentDate = addDays(currentDate, interval);
            } else if (type === 'weekly' && daysOfWeek) {
              // Find next occurrence based on daysOfWeek
              const nextDay = daysOfWeek.find(day => day > currentDate.getDay()) || daysOfWeek[0];
              currentDate = addDays(currentDate, (nextDay - currentDate.getDay() + 7) % 7);
            } else if (type === 'monthly') {
              currentDate = addMonths(currentDate, interval);
            } else if (type === 'custom') {
              currentDate = addWeeks(currentDate, interval);
            }

            if (currentDate <= end) {
              recurringEvents.push({
                ...newEvent,
                id: uuidv4(),
                startDate: new Date(currentDate),
                endDate: new Date(currentDate.getTime() + (eventData.endDate.getTime() - eventData.startDate.getTime())),
                originalEventId: newEvent.id,
              });
            }
          }
        }

        const conflicts = get().checkConflicts(newEvent);
        if (conflicts.length > 0) {
          set((state) => ({ conflicts: [...state.conflicts, ...conflicts] }));
        }

        set((state) => ({
          events: [...state.events, newEvent, ...recurringEvents],
        }));
      },

      updateEvent: (eventId, eventData) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId || event.originalEventId === eventId
              ? { ...event, ...eventData, id: event.id }
              : event
          ),
        }));
      },

      deleteEvent: (eventId) => {
        set((state) => ({
          events: state.events.filter(
            (event) => event.id !== eventId && event.originalEventId !== eventId
          ),
          conflicts: state.conflicts.filter((conflict) => conflict.eventId !== eventId),
        }));
      },

      moveEvent: (eventId, newDate) => {
        set((state) => ({
          events: state.events.map((event) => {
            if (event.id === eventId || event.originalEventId === eventId) {
              const duration = event.endDate.getTime() - event.startDate.getTime();
              const newStartDate = new Date(newDate);
              const newEndDate = new Date(newStartDate.getTime() + duration);
              return { ...event, startDate: newStartDate, endDate: newEndDate };
            }
            return event;
          }),
        }));
      },

      checkConflicts: (event) => {
        const conflicts = [];
        const { events } = get();

        events.forEach((existingEvent) => {
          if (existingEvent.id === event.id) return;

          const isOverlapping = isWithinInterval(event.startDate, {
            start: existingEvent.startDate,
            end: existingEvent.endDate,
          }) || isWithinInterval(event.endDate, {
            start: existingEvent.startDate,
            end: existingEvent.endDate,
          });

          if (isOverlapping) {
            conflicts.push({
              eventId: event.id,
              conflictingEventIds: [existingEvent.id],
              date: event.startDate,
            });
          }
        });

        return conflicts;
      },
    }),
    {
      name: 'calendar-storage',
      partialize: (state) => ({ events: state.events }),
    }
  )
);

export default useCalendarStore; 