"use server";
import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { hashSync } from "bcrypt";
import { getUniqueBDSId } from "@/shared/lib/bds-id";

export type ProductInput = {
  title: string;
  description: string;
  image: File | null;
};
export async function createEvent(data: FormData) {
  try {
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const imageFile = data.get("image") as File | null;

    if (!title || !description) {
      throw new Error("Title and description are required");
    }
    // Обработка изображения
    let imageUrl = "";
    // Обработка изображения, если оно есть
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      // Получаем расширение файла
      const fileExt = path.extname(imageFile.name);

      // Генерируем уникальное имя файла
      const fileName = `${randomUUID()}${fileExt}`;

      // Определяем путь для сохранения
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Создаем директорию, если ее нет
      await fs.mkdir(uploadDir, { recursive: true });

      // Полный путь к файлу
      const filePath = path.join(uploadDir, fileName);

      // Преобразуем файл в буфер и сохраняем
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      // URL для доступа к файлу
      imageUrl = `/uploads/${fileName}`;
    }

    const event = await prisma?.event.create({
      data: {
        title,
        description,
        imageUrl,
      },
    });

    redirect(`/event/${event.id}`);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  isOrganizer?: boolean;
  organizationName?: string;
  organizationCity?: string;
}) {
  const { fullName, password, email, phone, isOrganizer, organizationName, organizationCity } = data;
  const role = isOrganizer ? "ORGANIZER" : "USER";

  try {
    // Проверяем существование пользователя с таким email И ролью
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [{ email }, { role }],
      },
    });

    if (existingUser) {
      return {
        error: `Пользователь с таким email уже существует как ${isOrganizer ? "организатор" : "танцор"}`,
        status: 400,
      };
    }
    const bdsId = await getUniqueBDSId();
    const newUser = await prisma.user.create({
      data: {
        email,
        fullName: fullName || `User#${Math.random().toString(36).substring(2, 9)}`,
        password: hashSync(password, 10),
        phone,
        bdsId,
        role: role,
        isOrganizer: isOrganizer || false,
        organizationName: isOrganizer ? organizationName : undefined,
        organizationCity: isOrganizer ? organizationCity : undefined,
      },
    });

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "Ошибка регистрации",
      status: 500,
    };
  }
}
export async function addDanceStyleToUser(userId: string, danceStyleId: string) {
  return await prisma.userDanceStyle.create({
    data: {
      userId,
      danceStyleId,
    },
  });
}

export async function removeDanceStyleFromUser(userId: string, danceStyleId: string) {
  return await prisma.userDanceStyle.deleteMany({
    where: {
      userId,
      danceStyleId,
    },
  });
}

export async function getUserDanceStyles(userId: string) {
  return await prisma.userDanceStyle.findMany({
    where: { userId },
    include: { danceStyle: true },
  });
}
export async function getEvents(page: number = 1, limit: number = 10) {
  try {
    const response = await fetch(`/api/events?page=${page}&limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getEvent(id: string) {
  try {
    const response = await fetch(`/api/events/${id}`);
    if (!response.ok) {
      throw new Error("Event not found");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}
