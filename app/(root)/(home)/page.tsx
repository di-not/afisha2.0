'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (minPrice?: number, maxPrice?: number, isFree?: boolean) => {
    if (isFree) return 'Бесплатно';
    if (minPrice && maxPrice) return `${minPrice} - ${maxPrice} руб`;
    if (minPrice) return `от ${minPrice} руб`;
    if (maxPrice) return `до ${maxPrice} руб`;
    return 'Цена не указана';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8 ">
      <div className="w-full h-[360px] rounded-4xl mt-6 bg-gradient-to-br from-[#12aaff] to-[#0080f7] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Танцевальные мероприятия</h1>
            <p className="text-xl">Найдите свои следующие танцевальные приключения</p>
          </div>
        </div>
      </div>

      <h2 className="my-7 text-4xl font-bold text-black">Все мероприятия</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-blue-500 text-4xl">💃</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  {event.isOnline && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Online
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-xl mb-2 line-clamp-2">{event.title}</h3>
                
                {event.shortDescription && (
                  <p className="text-gray-600 mb-3 line-clamp-2">{event.shortDescription}</p>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    {event.startDate && (
                      <span>{formatDate(event.startDate)}</span>
                    )}
                    {event.place && (
                      <span className="block">{event.place.name}</span>
                    )}
                  </div>
                  <span className="font-bold text-blue-600">
                    {formatPrice(event.minPrice, event.maxPrice, event.isFree)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchEvents(page)}
                className={`px-3 py-2 rounded ${
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