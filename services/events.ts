import { prisma } from "@/shared/lib/prisma";
// import { ObjectId } from "mongodb";

export function getEventById(id: string) {
    if (!id || typeof id !== "string") {
        return null;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return null;
    }
    return prisma.event.findUnique({
        where: {
            id: id,
        },
        include: {
            place: true,
        },
    });
}
export function getAllEvents() {
    return prisma.event.findMany({
        include: {
            place: true,
        },
    });
}
