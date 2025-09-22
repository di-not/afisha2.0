"use client";

import { Event } from "@/prisma/types";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/components/ui/carousel";
import { useWindowSize } from "@/shared/hooks/useWindowsSize";
import Link from "next/link";

interface SubEventsProps {
  events: Event[];
}

export default function SubEvents({ events }: SubEventsProps) {
  const size = useWindowSize();
  const rule = size < 766 ? 20 + (766 - size) / 20 + "%" : size > 1300 ? "20%" : 20 + (1300 - size) / 40 + "%";
  console.log(rule);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  console.log();

  return (
    <div className="w-fit flex-1 max-w-[700px] ">
      <div className="relative w-full m-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          style={size > 760 ? { maxWidth: size - 515 } : { maxWidth: size - 80 }}
        >
          <CarouselContent className="-ml-4">
            {events.map((event) => (
              <CarouselItem style={{ flexBasis: rule }} key={event.id}>
                <Link href={`/event/${event.id}`} className="border-1 border-gray-200 w-full block h-full rounded-xl pb-2">
                  <div className="h-25 w-full">
                    <img src={event.imageUrl} alt="" className="w-full h-full object-cover rounded-t-xl" />
                  </div>
                  <div
                    className="text-black text-[13px] font-bold h-fit
                    line-clamp-[3] p-1 pb-0!"
                  >
                    {event.title}
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
