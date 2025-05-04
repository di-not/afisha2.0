import { Event, Place } from "@prisma/client";

export type EventType = Event & { place: Place };
