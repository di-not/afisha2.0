import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const event = await prisma.event.findUnique({
      where: { id: params.id },
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
            attendees: userId
              ? {
                  where: {
                    userId: userId,
                  },
                  select: {
                    status: true,
                  },
                }
              : false,
            favoritedBy: userId
              ? {
                  where: {
                    userId: userId,
                  },
                  select: {
                    id: true,
                  },
                }
              : false,
            bookmarkedBy: userId
              ? {
                  where: {
                    userId: userId,
                  },
                  select: {
                    id: true,
                  },
                }
              : false,
          },
          orderBy: {
            startDate: "asc",
          },
        },
        attendees: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                status: true,
              },
            }
          : false,
        favoritedBy: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                id: true,
              },
            }
          : false,
        bookmarkedBy: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const eventWithUserStatus = {
      ...event,
      userStatus: userId
        ? {
            isFavorite: event.favoritedBy && event.favoritedBy.length > 0,
            isBookmarked: event.bookmarkedBy && event.bookmarkedBy.length > 0,
            attendanceStatus: (event.attendees && event.attendees[0]?.status) || null,
          }
        : null,
      // Добавляем userStatus для подсобытий
      subEvents: event.subEvents.map((subEvent) => ({
        ...subEvent,
        userStatus: userId
          ? {
              isFavorite: subEvent.favoritedBy && subEvent.favoritedBy.length > 0,
              isBookmarked: subEvent.bookmarkedBy && subEvent.bookmarkedBy.length > 0,
              attendanceStatus: (subEvent.attendees && subEvent.attendees[0]?.status) || null,
            }
          : null,
      })),
    };

    return NextResponse.json(eventWithUserStatus);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
