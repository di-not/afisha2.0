import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EventStatus {
  isFavorite: boolean;
  isBookmarked: boolean;
  attendanceStatus: string | null;
}

interface EventStore {
  // Состояния мероприятий
  eventStatuses: Record<string, EventStatus>;
  
  // Действия
  setEventStatus: (eventId: string, status: EventStatus) => void;
  updateEventStatus: (eventId: string, updates: Partial<EventStatus>) => void;
  getEventStatus: (eventId: string) => EventStatus;
  
  // Синхронизация с сервером
  fetchEventStatus: (eventId: string) => Promise<void>;
  performAction: (eventId: string, action: string, data?: any) => Promise<void>;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      eventStatuses: {},
      
      setEventStatus: (eventId, status) => set((state) => ({
        eventStatuses: {
          ...state.eventStatuses,
          [eventId]: status
        }
      })),
      
      updateEventStatus: (eventId, updates) => set((state) => ({
        eventStatuses: {
          ...state.eventStatuses,
          [eventId]: {
            ...state.eventStatuses[eventId],
            ...updates
          }
        }
      })),
      
      getEventStatus: (eventId) => {
        return get().eventStatuses[eventId] || {
          isFavorite: false,
          isBookmarked: false,
          attendanceStatus: null
        };
      },
      
      fetchEventStatus: async (eventId) => {
        try {
          const response = await fetch(`/api/user/events/attendance/${eventId}`);
          if (response.ok) {
            const data = await response.json();
            get().setEventStatus(eventId, data);
          }
        } catch (error) {
          console.error('Error fetching event status:', error);
        }
      },
      
      performAction: async (eventId, action, data) => {
        try {
          const response = await fetch(`/api/user/events/attendance/${eventId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action, ...data }),
          });

          if (response.ok) {
            const result = await response.json();
            
            if (action === "attendance") {
              get().updateEventStatus(eventId, { attendanceStatus: data?.status });
            } else {
              get().updateEventStatus(eventId, result);
            }
            
            // Перезагружаем статус для синхронизации
            await get().fetchEventStatus(eventId);
          }
        } catch (error) {
          console.error('Error performing action:', error);
        }
      }
    }),
    {
      name: 'event-storage', // имя для localStorage
    }
  )
);