import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    const danceStyles = await prisma.danceStyle.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
      take: 20, // Ограничиваем количество результатов
    });
    
    return NextResponse.json(danceStyles);
  } catch (error) {
    console.error('Error searching dance styles:', error);
    return NextResponse.json(
      { error: 'Failed to search dance styles' },
      { status: 500 }
    );
  }
}