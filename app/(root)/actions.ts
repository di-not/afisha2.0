"use server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { hashSync } from "bcrypt";

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
}) {
    const { fullName, password, email } = data;
    try {
        const existingUser = await prisma.user.findFirst({
            where: { email },
        });

        if (existingUser) {
            return {
                error: "Пользователь с таким email уже существует",
                status: 400,
            };
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                fullName:
                    fullName ||
                    `User#${Math.random().toString(36).substring(2, 9)}`,
                password: hashSync(password, 10),
                role: "USER",
            },
        });

        // Возвращаем полные данные пользователя
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
