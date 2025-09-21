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

    const formData = await request.formData();
    const mainStyle = formData.get('mainStyle') as string;
    const additionalStyles = formData.getAll('additionalStyles') as string[];
    const about = formData.get('about') as string;

    // Обновляем основные данные
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        about,
        mainDanceStyleId: mainStyle || null,
      },
    });

    // Обновляем дополнительные стили
    await prisma.userDanceStyle.deleteMany({
      where: { userId: session.user.id }
    });

    if (additionalStyles.length > 0) {
      await prisma.userDanceStyle.createMany({
        data: additionalStyles.map(styleId => ({
          userId: session.user.id,
          danceStyleId: styleId
        }))
      });
    }

    // Получаем обновленного пользователя с полными данными
    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
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

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating dancer profile:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления профиля танцора' },
      { status: 500 }
    );
  }
}