// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/shared/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const data = await request.json();
    
    // Проверяем, не используется ли email другим пользователем
    if (data.email && data.email !== session.user.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: session.user.id }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone: data.phone || null,
        email: data.email,
        city: data.city || null,
        avatar: data.avatar || undefined,
      },
      include: {
        mainDanceStyle: true,
        additionalStyles: {
          include: {
            danceStyle: true
          }
        },
        danceSchool: true,
        organizationStyle: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления профиля' },
      { status: 500 }
    );
  }
}