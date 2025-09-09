import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const events = await prisma.event.findMany({
      where: {
        isArchived: false,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.event.count({
      where: {
        isArchived: false,
        isConfirmed: true,
      },
    });

    const eventsWithTags = events.map((event: { tags: any[] }) => ({
      ...event,
      tags: event.tags,
    }));

    return NextResponse.json({
      events: eventsWithTags,
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
