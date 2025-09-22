import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const fetchSingleEvent = async (id: string) => {
  if (!id) {
    throw new Error("Event id must be provided");
  }
  const session = await getServerSession(authOptions);
  const event = await prisma.event.findUnique({
    where: { id },
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
      parentEvent: {
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
            danceStyle: true,
          },
        },
      // Добавляем подсобытия
      subEvents: {
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
          attendees: session
            ? {
                where: {
                  userId: session.user.id,
                },
                select: {
                  status: true,
                },
              }
            : false,
          favoritedBy: session
            ? {
                where: {
                  userId: session.user.id,
                },
                select: {
                  id: true,
                },
              }
            : false,
          bookmarkedBy: session
            ? {
                where: {
                  userId: session.user.id,
                },
                select: {
                  id: true,
                },
              }
            : false,
        },
        orderBy: {
          startDate: 'asc',
        },
      },
      attendees: session
        ? {
            where: {
              userId: session.user.id,
            },
            select: {
              status: true,
            },
          }
        : false,
      favoritedBy: session
        ? {
            where: {
              userId: session.user.id,
            },
            select: {
              id: true,
            },
          }
        : false,
      bookmarkedBy: session
        ? {
            where: {
              userId: session.user.id,
            },
            select: {
              id: true,
            },
          }
        : false,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const eventWithUserStatus = {
    ...event,
    userStatus: session
      ? {
          isFavorite: event.favoritedBy.length > 0,
          isBookmarked: event.bookmarkedBy.length > 0,
          attendanceStatus: event.attendees[0]?.status || null,
        }
      : null,
    // Добавляем userStatus для подсобытий
    subEvents: event.subEvents.map(subEvent => ({
      ...subEvent,
      userStatus: session
        ? {
            isFavorite: subEvent.favoritedBy.length > 0,
            isBookmarked: subEvent.bookmarkedBy.length > 0,
            attendanceStatus: subEvent.attendees[0]?.status || null,
          }
        : null,
    })),
  };

  return eventWithUserStatus;
};