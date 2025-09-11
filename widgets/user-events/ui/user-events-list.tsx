"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

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

interface UserEventsListProps {
  type: "favorite" | "bookmarks" | "gonnago" | "willgo";
  title: string;
}

export default function UserEventsList({ type, title }: UserEventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      fetchEvents();
    }
  }, [type, status]);

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/events/lists/${type}?page=${page}&limit=12`);

      if (response.status === 401) {
        // Пользователь не авторизован
        setEvents([]);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setEvents(data.events);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching user events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (minPrice?: number, maxPrice?: number, isFree?: boolean) => {
    if (isFree) return "Бесплатно";
    if (minPrice && maxPrice) return `${minPrice} - ${maxPrice} руб`;
    if (minPrice) return `от ${minPrice} руб`;
    if (maxPrice) return `до ${maxPrice} руб`;
    return "Цена не указана";
  };

  if (status === "loading" || loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
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

  if (!session) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Требуется авторизация</h3>
          <p className="text-yellow-700 mb-4">Для просмотра ваших мероприятий необходимо войти в систему</p>
          <Link
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Здесь пока ничего нет</h3>
          <p className="text-gray-500 mb-4">
            {type === "favorite" && "Добавьте мероприятия в избранное, чтобы они появились здесь"}
            {type === "bookmarks" && "Добавьте мероприятия в закладки, чтобы они появились здесь"}
            {type === "gonnago" && 'Отметьте мероприятия как "Я собираюсь", чтобы они появились здесь'}
            {type === "willgo" && 'Отметьте мероприятия как "Я пойду", чтобы они появились здесь'}
          </p>
          <Link
            href="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block"
          >
            Найти мероприятия
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative h-48">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>

                    {event.shortDescription && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{event.shortDescription}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div>
                        {event.startDate && <span className="block">{formatDate(event.startDate)}</span>}
                        {event.place && <span className="block text-xs">{event.place.name}</span>}
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
                {pagination.page > 1 && (
                  <button
                    onClick={() => fetchEvents(pagination.page - 1)}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Назад
                  </button>
                )}

                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (pagination.page > 3) {
                    pageNum = pagination.page - 2 + i;
                  }
                  if (pageNum > pagination.pages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchEvents(pageNum)}
                      className={`px-4 py-2 rounded ${
                        pagination.page === pageNum
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {pagination.page < pagination.pages && (
                  <button
                    onClick={() => fetchEvents(pagination.page + 1)}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Вперед
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
