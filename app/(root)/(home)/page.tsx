'use client';

import EventCard from '@/widgets/event/ui/event-card';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  isOnline: boolean;
  isFree: boolean;
  place?: {
    name: string;
    url?: string;
  };
  tags: Array<{
    name: string;
    color?: string;
  }>;
  userStatus?: {
    isFavorite: boolean;
    isBookmarked: boolean;
    attendanceStatus: string | null;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function HomePage() {
  
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events?page=${page}&limit=12`);
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Герой баннер */}
        <div className="w-full h-[360px] rounded-4xl mt-6 bg-gradient-to-br from-[#12aaff] to-[#0080f7] animate-pulse"></div>
        
        <h2 className="my-7 text-4xl font-bold text-black">Все мероприятия</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Герой баннер */}
      <div className="w-full h-[360px] rounded-4xl mt-6 bg-gradient-to-br from-[#12aaff] to-[#0080f7] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Танцевальные мероприятия</h1>
            <p className="text-xl">Найдите свои следующие танцевальные приключения</p>
          </div>
        </div>
      </div>

      <h2 className="my-7 text-4xl font-bold text-black">Все мероприятия</h2>

      {/* Сетка мероприятий */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Пагинация */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchEvents(page)}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}