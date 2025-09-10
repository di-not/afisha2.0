import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/shared/lib/prisma';
import { EventAttendanceStatus } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    let events: any[] = [];
    let total = 0;

    switch (params.type) {
      case 'favorite':
        const favoriteData = await prisma.userFavoriteEvent.findMany({
          where: { userId: session.user.id },
          include: {
            event: {
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
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        });
        
        events = favoriteData.map(item => ({
          ...item.event,
          // Добавляем информацию о том, что это избранное
          isFavorite: true
        }));
        total = await prisma.userFavoriteEvent.count({
          where: { userId: session.user.id }
        });
        break;

      case 'bookmarks':
        const bookmarksData = await prisma.userBookmarkedEvent.findMany({
          where: { userId: session.user.id },
          include: {
            event: {
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
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        });
        
        events = bookmarksData.map(item => ({
          ...item.event,
          // Добавляем информацию о том, что это в закладках
          isBookmarked: true
        }));
        total = await prisma.userBookmarkedEvent.count({
          where: { userId: session.user.id }
        });
        break;

      case 'gonnago':
        const gonnagoData = await prisma.userEvent.findMany({
          where: { 
            userId: session.user.id,
            status: EventAttendanceStatus.INTERESTED
          },
          include: {
            event: {
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
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        });
        
        events = gonnagoData.map(item => ({
          ...item.event,
          // Добавляем информацию о статусе
          attendanceStatus: item.status
        }));
        total = await prisma.userEvent.count({
          where: { 
            userId: session.user.id,
            status: EventAttendanceStatus.INTERESTED
          }
        });
        break;

      case 'willgo':
        const willgoData = await prisma.userEvent.findMany({
          where: { 
            userId: session.user.id,
            status: EventAttendanceStatus.GOING
          },
          include: {
            event: {
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
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        });
        
        events = willgoData.map(item => ({
          ...item.event,
          // Добавляем информацию о статусе
          attendanceStatus: item.status
        }));
        total = await prisma.userEvent.count({
          where: { 
            userId: session.user.id,
            status: EventAttendanceStatus.GOING
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Неверный тип запроса. Доступные типы: favorite, bookmarks, gonnago, willgo' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json(
      { error: 'Ошибка получения мероприятий пользователя' }, // Исправлено сообщение об ошибке
      { status: 500 }
    );
  }
}