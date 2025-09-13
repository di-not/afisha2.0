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

    // Получаем текущего пользователя для проверки провайдера
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { provider: true, email: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const data = await request.json();
    
    // Запрещаем менять email для Яндекс пользователей
    if (currentUser.provider && currentUser.provider.startsWith('yandex')) {
      if (data.email && data.email !== currentUser.email) {
        return NextResponse.json(
          { error: 'Для пользователей Яндекс изменение email запрещено' },
          { status: 400 }
        );
      }
      // Убираем email из данных для обновления
      delete data.email;
    } else {
      // Проверяем email для обычных пользователей
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
    }

    // Обновляем данные пользователя
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: data.fullName,
        phone: data.phone || null,
        email: data.email, // Будет undefined для Яндекс пользователей
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