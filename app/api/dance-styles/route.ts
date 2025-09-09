
import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    const danceStyles = await prisma.danceStyle.findMany({
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(danceStyles);
  } catch (error) {
    console.error('Error fetching dance styles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dance styles' },
      { status: 500 }
    );
  }
}