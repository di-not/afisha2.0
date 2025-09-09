import { prisma } from "@/shared/lib/prisma";

export const fetchSingleEvent = async (id: string) => {
  console.log("id", id);

  if (!id) {
    throw new Error("Event id must be provided");
  }
  const event = await prisma.event.findUnique({
    where: { id: id },
    include: {
      place: true,
      tags: true,

      organizer: {
        select: {
          id: true,
          fullName: true,
          organizationName: true,
          organizationCity: true,
        },
      },
      timetables: {
        include: {
          timestamps: true,
        },
      },
      socials: true,
      documents: true,
      danceStyle: true,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};
