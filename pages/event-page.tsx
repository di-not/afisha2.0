"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Event } from "@/prisma/types";
import { IconHome } from "@/shared/icons/home";
import { IconOrganizers } from "@/shared/icons/organizers";
import TabNavigation from "@/shared/components/ui/tab-navigation";
import { IconDescription } from "@/shared/icons/description";
import { IconSubevents } from "@/shared/icons/subevents";
import { IconTimestamps } from "@/shared/icons/timestamps";
import { IconDocuments } from "@/shared/icons/documents";
import { IconSponsors } from "@/shared/icons/sponsors";
import { IconLocation } from "@/shared/icons/location";
import DescriptionBlock from "@/widgets/event/ui/description-block";
import Timetable from "@/widgets/event/ui/timetables-block";
import { IconBookmark } from "@/shared/icons/bookmark";
import { IconFavorite } from "@/shared/icons/favorite";

export type ActiveTab = "description" | "timetable" | "organizers" | "documents";

const tabs = [
  { id: "organizers" as ActiveTab, label: "Организаторы", icon: <IconOrganizers className="size-[24px]" /> },
  { id: "description" as ActiveTab, label: "Описание", icon: <IconDescription className="size-[24px]" /> },
  { id: "subevents" as ActiveTab, label: "Подсобытия", icon: <IconSubevents className="size-[24px]" /> },
  { id: "timetable" as ActiveTab, label: "Расписание", icon: <IconTimestamps className="size-[24px]" /> },
  { id: "documents" as ActiveTab, label: "Документы", icon: <IconDocuments className="size-[24px]" /> },
  { id: "sponsors" as ActiveTab, label: "Спонсоры", icon: <IconSponsors className="size-[24px]" /> },
];

export default function EventPage({ event }: { event: Event }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("organizers");
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

  return (
    <div
      className="min-h-screen pt-25"
      style={{
        background: `linear-gradient(#00a3ff 300px, #ffffff 300px)`,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          {/* Хлебные крошки */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <Link
                className="transition duration-300 ease-in-out bgPrimary rounded-full p-1 px-4 text-white font-medium flex gap-2 items-center hover:scale-110"
                href="/"
              >
                <IconHome className="text-white" />
                Главная
              </Link>
              <li className="bgPrimary rounded-full p-1 px-4 text-white font-medium ">{event.title}</li>
            </ol>
          </nav>
          <div className="flex gap-2">
            <button className="bgPrimary text-white h-fit p-2 rounded-full flex justify-center items-center">
              <IconBookmark className=" size-[18px]" />
            </button>
            <button className="bgPrimary text-white h-fit p-2 rounded-full flex justify-center items-center">
              <IconFavorite className=" size-[18px]" />
            </button>
          </div>
        </div>

        <div className="flex gap-6 max-md:flex-col! ">
          {/* Левая колонка */}
          <div className="space-y-6 w-100 max-md:w-full ">
            {/* Изображение */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-full w-full">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="object-cover"
                  onClick={() => setImageSourceVisible(!imageSourceVisible)}
                />
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
          <div className="flex-1 h-fit">
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>

              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
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
              <div className="flex items-center my-1">
                {event.place ? (
                  event.place.url ? (
                    <>
                      <IconLocation className="text-[var(--primary)] size-[24px]" />
                      <a
                        href={event.place.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary)] hover:text-[var(--primary)]/80 font-bold transition duration-300 ease-in-out"
                      >
                        {event.place.name}
                      </a>
                    </>
                  ) : (
                    <span>
                      <IconLocation className="text-[var(--primary)]" /> {event.place.name}
                    </span>
                  )
                ) : (
                  <span>{event.isOnline ? "Онлайн" : "Место не указано"}</span>
                )}
              </div>

              {event.startDate && (
                <div className="text-gray-600 mb-2">
                  <p>С: {formatDateTime(event.startDate)}</p>
                  {event.endDate && <p>По: {formatDateTime(event.endDate)}</p>}
                </div>
              )}

              {event.shortDescription && <p className="font-normal text-lg mb-2">{event.shortDescription}</p>}

              {/* Навигация по табам */}
              <TabNavigation tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />

              {/* Контент табов */}
              <div className="mt-2">
                {activeTab === "description" && (
                  <>
                    <h3 className="font-bold text-black text-2xl mb-2">Описание</h3>
                    {event.description ? (
                      <DescriptionBlock description={event.description} activeTab={activeTab} />
                    ) : (
                      <>Описание не указано...</>
                    )}
                  </>
                )}
                {activeTab === "organizers" && (
                  <div>
                    <h3 className="font-bold text-black text-2xl mb-2">Организатор</h3>
                    {event.organizer ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-semibold">{event.organizer.organizationName || event.organizer.fullName}</p>
                        {event.organizer.organizationCity && (
                          <p className="text-gray-600">{event.organizer.organizationCity}</p>
                        )}
                      </div>
                    ) : (
                      <>Организаторы не указаны...</>
                    )}
                  </div>
                )}

                {activeTab === "timetable" && (
                  <>
                    <h3 className="font-bold text-black text-2xl mb-2">Расписание</h3>
                    {event.timetables && event.timetables.length > 0 ? (
                      <Timetable days={event.timetables} />
                    ) : (
                      <>Расписание не указано...</>
                    )}
                  </>
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
