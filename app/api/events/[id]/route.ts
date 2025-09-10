import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
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
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
    };

    return NextResponse.json(eventWithUserStatus);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
