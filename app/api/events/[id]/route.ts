import { prisma } from '@/shared/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
          }
        },
        timetables: {
          include: {
            timestamps: true
          }
        },
        socials: true,
        documents: true,
        danceStyle: true
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const eventWithTags = {
      ...event,
      tags: event.tags,
      timetable: event.timetables 
    };

    return NextResponse.json(eventWithTags);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}