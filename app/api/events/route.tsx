import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Проверяем, есть ли авторизованный пользователь
    const userId = session?.user?.id;

    const events = await prisma.event.findMany({
      where: {
        isArchived: false,
        isConfirmed: true,
      },
      include: {
        place: true,
        tags: true,
        organizer: {
          select: {
            id: true,
            fullName: true,
            organizationName: true,
          },
        },
        danceStyle: true,
        attendees: userId ? {
          where: {
            userId: userId
          },
          select: {
            status: true
          }
        } : false,
        favoritedBy: userId ? {
          where: {
            userId: userId
          },
          select: {
            id: true
          }
        } : false,
        bookmarkedBy: userId ? {
          where: {
            userId: userId
          },
          select: {
            id: true
          }
        } : false,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const total = await prisma.event.count({
      where: {
        isArchived: false,
        isConfirmed: true,
      },
    });

    // Преобразуем данные для удобства использования
    const eventsWithUserStatus = events.map(event => ({
      ...event,
      // Добавляем поля статуса пользователя
      userStatus: userId ? {
        isFavorite: event.favoritedBy && event.favoritedBy.length > 0,
        isBookmarked: event.bookmarkedBy && event.bookmarkedBy.length > 0,
        attendanceStatus: event.attendees && event.attendees[0]?.status || null
      } : null
    }));

    return NextResponse.json({
      events: eventsWithUserStatus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}