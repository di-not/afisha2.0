"use client";

import { useState } from "react";

interface Timestamp {
  id: string;
  name: string;
  time?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  shortDescription?: string | null;
}

interface Day {
  id: string;
  name?: string | null;
  date?: Date | null;
  dateName?: string | null;
  timestamps: Timestamp[];
}

interface TimetableProps {
  days: Day[];
}

export default function Timetable({ days }: TimetableProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const toggleDay = (index: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDays(newExpanded);
  };

  // Вспомогательные функции для безопасного доступа
  const safeString = (str?: string | null) => str || "";
  const safeDate = (date?: Date | null) => (date ? date : null);

  return (
    <div className="space-y-3">
      {days.map((day, index) => {
        const dayName = safeString(day.name);
        const dateName = safeString(day.dateName);
        const date = safeDate(day.date);
        const isExpanded = expandedDays.has(index);

        return (
          <div key={day.id} className="border border-gray-200 rounded-4xl overflow-hidden transition-all duration-200">
            
            {/* Заголовок дня */}
            <button
              onClick={() => toggleDay(index)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {dayName}
                  {dateName && ` (${dateName})`}
                </h3>
                {date && <p className="text-sm text-gray-600 mt-1">{formatDate(date)}</p>}
              </div>
              <span className="text-gray-500 text-xl font-bold transition-transform duration-200">
                {isExpanded ? "−" : "+"}
              </span>
            </button>

            {/* Контент дня */}
            {isExpanded && (
              <div className="px-4 bg-white ">
                {day.timestamps.map((timestamp) => {
                  const timeDisplay =
                    safeString(timestamp.time) ||
                    (timestamp.startTime && timestamp.endTime
                      ? `${safeString(timestamp.startTime)}  ${safeString(timestamp.endTime)}`
                      : "Время TBA");

                  return (
                    <div key={timestamp.id} className="py-3 flex">
                        <span className="bgButton w-full max-w-2 block rounded-l-full! mr-4"></span>
                      <div className="">
                        <div className="flex max:sm:flex-col flex-row items-start gap-4 ">
                          {/* Время */}
                          <div className="w-full sm:w-32 flex-shrink-0 flex h-full">
                            <div className="px-3 py-2 rounded-lg text-center font-semibold text-sm my-auto">
                              {timeDisplay}
                            </div>
                          </div>

                          {/* Описание */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base mb-2">{safeString(timestamp.name)}</h4>
                            {timestamp.shortDescription && (
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {safeString(timestamp.shortDescription)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
