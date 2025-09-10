import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/shared/lib/prisma";
import { EventAttendanceStatus } from "@prisma/client";

export async function POST(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { action, status } = await request.json();
    const eventId = params.eventId;

    // Проверяем существование события
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Событие не найдено" }, { status: 404 });
    }

    switch (action) {
      case "favorite":
        // Добавление/удаление из избранного
        const existingFavorite = await prisma.userFavoriteEvent.findUnique({
          where: {
            userId_eventId: {
              userId: session.user.id,
              eventId: eventId,
            },
          },
        });

        if (existingFavorite) {
          await prisma.userFavoriteEvent.delete({
            where: {
              userId_eventId: {
                userId: session.user.id,
                eventId: eventId,
              },
            },
          });
          return NextResponse.json({ success: true, isFavorite: false });
        } else {
          await prisma.userFavoriteEvent.create({
            data: {
              userId: session.user.id,
              eventId: eventId,
            },
          });
          return NextResponse.json({ success: true, isFavorite: true });
        }

      case "bookmark":
        // Добавление/удаление из закладок
        const existingBookmark = await prisma.userBookmarkedEvent.findUnique({
          where: {
            userId_eventId: {
              userId: session.user.id,
              eventId: eventId,
            },
          },
        });

        if (existingBookmark) {
          await prisma.userBookmarkedEvent.delete({
            where: {
              userId_eventId: {
                userId: session.user.id,
                eventId: eventId,
              },
            },
          });
          return NextResponse.json({ success: true, isBookmarked: false });
        } else {
          await prisma.userBookmarkedEvent.create({
            data: {
              userId: session.user.id,
              eventId: eventId,
            },
          });
          return NextResponse.json({ success: true, isBookmarked: true });
        }

      case "attendance":
        // Установка статуса посещения
        if (!status || !Object.values(EventAttendanceStatus).includes(status as EventAttendanceStatus)) {
          return NextResponse.json({ error: "Неверный статус" }, { status: 400 });
        }

        const existingAttendance = await prisma.userEvent.findUnique({
          where: {
            userId_eventId: {
              userId: session.user.id,
              eventId: eventId,
            },
          },
        });

        if (existingAttendance) {
          await prisma.userEvent.update({
            where: {
              userId_eventId: {
                userId: session.user.id,
                eventId: eventId,
              },
            },
            data: { status: status as EventAttendanceStatus },
          });
        } else {
          await prisma.userEvent.create({
            data: {
              userId: session.user.id,
              eventId: eventId,
              status: status as EventAttendanceStatus,
            },
          });
        }

        return NextResponse.json({ success: true, status });

      default:
        return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error managing event:", error);
    return NextResponse.json({ error: "Ошибка управления событием" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const eventId = params.eventId;

    const [favorite, bookmarked, attendance] = await Promise.all([
      prisma.userFavoriteEvent.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId,
          },
        },
      }),
      prisma.userBookmarkedEvent.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId,
          },
        },
      }),
      prisma.userEvent.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: eventId,
          },
        },
      }),
    ]);

    return NextResponse.json({
      isFavorite: !!favorite,
      isBookmarked: !!bookmarked,
      attendanceStatus: attendance?.status || null,
    });
  } catch (error) {
    console.error("Error fetching event status:", error);
    return NextResponse.json({ error: "Ошибка получения статуса события" }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const eventId = params.eventId;

    // Удаляем все статусы посещения для этого события
    await prisma.userEvent.deleteMany({
      where: {
        userId: session.user.id,
        eventId: eventId,
      },
    });

    return NextResponse.json({
      success: true,
      attendanceStatus: null,
    });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json({ error: "Ошибка удаления статуса посещения" }, { status: 500 });
  }
}
