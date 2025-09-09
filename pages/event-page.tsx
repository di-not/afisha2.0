"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/prisma/types";
import { IconHome } from "@/shared/icons/home";

type ActiveTab = "description" | "timetable" | "organizers" | "documents";

export default function EventPage({ event }: { event: Event }) {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>("description");
  const [imageSourceVisible, setImageSourceVisible] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (
    minPrice?: number | null | undefined,
    maxPrice?: number | null | undefined,
    isFree?: boolean
  ) => {
    if (isFree) return "Бесплатно";
    if (minPrice && maxPrice) return `${minPrice} - ${maxPrice} руб`;
    if (minPrice) return `от ${minPrice} руб`;
    if (maxPrice) return `до ${maxPrice} руб`;
    return "Цена не указана";
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Мероприятие не найдено</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }
  console.log(event)
  
  return (
    <div
      className="min-h-screen pt-25 "
      style={{
        background: `linear-gradient(#00a3ff 300px, #ffffff 300px)`,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <Link className="transition duration-300 ease-in-out bgPrimary rounded-full p-1 px-4 text-white font-medium flex gap-2 items-center hover:scale-110" href="/">
              <IconHome className="text-white" />
              Главная
            </Link>
            <li className="bgPrimary rounded-full p-1 px-4 text-white font-medium ">{event.title}</li>
          </ol>
        </nav>

        <div className="flex gap-6 ">
          {/* Левая колонка */}
          <div className=" space-y-6 flex-5 min-w-[320px]">
            {/* Изображение */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-full w-full">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="object-cover"
                    onClick={() => setImageSourceVisible(!imageSourceVisible)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-blue-500 text-6xl">💃</span>
                  </div>
                )}
              </div>
              {imageSourceVisible && (
                <div className="p-4 text-xs text-gray-500">
                  Источник: {event.imageUrl ? new URL(event.imageUrl).hostname : "не указан"}
                </div>
              )}
            </div>

            {/* Блок цены */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">Диапазон цен</h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                {formatPrice(event.minPrice, event.maxPrice, event.isFree)}
              </p>

              {event.organizer && (
                <Link
                  href={`/organizer/${event.organizer.id}`}
                  className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg text-center font-medium hover:from-blue-600 hover:to-blue-700 transition-colors mb-4"
                >
                  Связаться с организатором
                </Link>
              )}
            </div>
          </div>

          {/* Правая колонка */}
          <div className="flex-7">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: tag.color || "#e5e7eb" }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Место и дата */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">📍</span>
                {event.place ? (
                  event.place.url ? (
                    <a
                      href={event.place.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {event.place.name}
                    </a>
                  ) : (
                    <span>{event.place.name}</span>
                  )
                ) : (
                  <span>{event.isOnline ? "Онлайн" : "Место не указано"}</span>
                )}
              </div>

              {event.startDate && (
                <div className="text-gray-600 mb-4">
                  <p>С: {formatDateTime(event.startDate)}</p>
                  {event.endDate && <p>По: {formatDateTime(event.endDate)}</p>}
                </div>
              )}

              {event.shortDescription && <p className="text-gray-700 text-lg mb-6">{event.shortDescription}</p>}

              {/* Навигация по табам */}
              <nav className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  {[
                    { id: "description" as ActiveTab, label: "Описание" },
                    { id: "timetable" as ActiveTab, label: "Расписание" },
                    { id: "organizers" as ActiveTab, label: "Организаторы" },
                    { id: "documents" as ActiveTab, label: "Документы" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 font-medium text-sm ${
                        activeTab === tab.id
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Контент табов */}
              <div className="min-h-[300px]">
                {activeTab === "description" && event.description && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                )}

                {event.timetable && activeTab === "timetable" && event.timetable.length > 0 && (
                  <div className="space-y-6">
                    {event.timetable.map((day) => (
                      <div key={day.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <h3 className="font-bold text-xl mb-4">
                          {day.name || formatDate(day.date!)}
                          {day.dateName && ` (${day.dateName})`}
                        </h3>

                        <div className="space-y-4">
                          {day.timestamps.map((timestamp) => (
                            <div key={timestamp.id} className="flex gap-4">
                              <div className="w-24 flex-shrink-0 text-gray-600 font-medium">
                                {timestamp.time || `${timestamp.startTime} - ${timestamp.endTime}`}
                              </div>
                              <div>
                                <h4 className="font-semibold">{timestamp.name}</h4>
                                {timestamp.shortDescription && (
                                  <p className="text-gray-600 text-sm mt-1">{timestamp.shortDescription}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "organizers" && event.organizer && (
                  <div>
                    <h3 className="font-bold text-xl mb-4">Организатор</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold">{event.organizer.organizationName || event.organizer.fullName}</p>
                      {event.organizer.organizationCity && (
                        <p className="text-gray-600">{event.organizer.organizationCity}</p>
                      )}
                    </div>
                  </div>
                )}

                {event.documents && activeTab === "documents" && event.documents.length > 0 && (
                  <div>
                    <h3 className="font-bold text-xl mb-4">Документы</h3>
                    <div className="space-y-2">
                      {event.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                        >
                          <span>📄</span>
                          {doc.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Социальные сети */}
              {event.socials && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-lg mb-4">Социальные сети</h3>
                  <div className="flex gap-4">
                    {event.socials.vk && (
                      <a
                        href={event.socials.vk}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        VK
                      </a>
                    )}
                    {event.socials.instagram && (
                      <a
                        href={event.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-600"
                      >
                        Instagram
                      </a>
                    )}
                    {event.socials.telegram && (
                      <a
                        href={event.socials.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-400"
                      >
                        Telegram
                      </a>
                    )}
                    {event.socials.youtube && (
                      <a
                        href={event.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600"
                      >
                        YouTube
                      </a>
                    )}
                    {event.socials.site && (
                      <a
                        href={event.socials.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        Сайт
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
