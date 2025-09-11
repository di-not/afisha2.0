import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/shared/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File;

    if (!avatarFile) {
      return NextResponse.json({ error: 'Файл не предоставлен' }, { status: 400 });
    }

    // Создаем буфер из файла
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    
    // Генерируем уникальное имя файла
    const fileExt = path.extname(avatarFile.name);
    const fileName = `${randomUUID()}${fileExt}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    
    // Создаем директорию, если ее нет
    await mkdir(uploadDir, { recursive: true });
    
    // Сохраняем файл
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // URL для доступа к файлу
    const avatarUrl = `/uploads/avatars/${fileName}`;

    // Обновляем аватар пользователя в базе данных
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки аватарки' },
      { status: 500 }
    );
  }
}