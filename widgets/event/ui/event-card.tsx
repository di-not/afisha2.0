"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconBookmark } from "@/shared/icons/bookmark";
import { IconFavorite } from "@/shared/icons/favorite";
import { useSession } from "next-auth/react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    imageUrl?: string;
    startDate?: Date;
    endDate?: Date;
    minPrice?: number;
    maxPrice?: number;
    isOnline: boolean;
    isFree: boolean;
    place?: {
      name: string;
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
  };
}

export default function EventCard({ event }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState({
    isFavorite: event.userStatus?.isFavorite || false,
    isBookmarked: event.userStatus?.isBookmarked || false,
  });
  const { data: session } = useSession();

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

  const handleAction = async (action: string) => {
    if (!session) {
      // Можно перенаправить на страницу входа или показать модальное окно
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/user/events/attendance/${event.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Обновляем локальное состояние
        if (action === "favorite") {
          setLocalStatus(prev => ({ ...prev, isFavorite: result.isFavorite }));
        } else if (action === "bookmark") {
          setLocalStatus(prev => ({ ...prev, isBookmarked: result.isBookmarked }));
        }
      }
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setLoading(false);
    }
  };

  // Используем локальное состояние если пользователь авторизован, иначе данные из props
  const displayStatus = session ? localStatus : {
    isFavorite: event.userStatus?.isFavorite || false,
    isBookmarked: event.userStatus?.isBookmarked || false,
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative">
      {/* Кнопки действий */}
      {session && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              displayStatus.isFavorite 
                ? "bg-red-500/90 text-white" 
                : "bg-white/80 text-gray-600 hover:bg-white"
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAction("favorite");
            }}
            disabled={loading}
          >
            <IconFavorite className="size-4" />
          </button>
          <button
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              displayStatus.isBookmarked 
                ? "bg-blue-500/90 text-white" 
                : "bg-white/80 text-gray-600 hover:bg-white"
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAction("bookmark");
            }}
            disabled={loading}
          >
            <IconBookmark className="size-4" />
          </button>
        </div>
      )}

      <Link href={`/event/${event.id}`}>
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
          
          {event.isOnline && (
            <div className="absolute top-3 left-3">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Online
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {event.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
              {event.tags.length > 2 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  +{event.tags.length - 2}
                </span>
              )}
            </div>
          )}

          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          <div className="space-y-1 mb-3">
            {event.startDate && (
              <div className="text-sm text-gray-600">
                {formatDate(event.startDate)}
                {event.endDate && ` - ${formatDate(event.endDate)}`}
              </div>
            )}
            {event.place && (
              <div className="text-sm text-gray-600">
                {event.place.name}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-600 text-sm">
              {formatPrice(event.minPrice, event.maxPrice, event.isFree)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}