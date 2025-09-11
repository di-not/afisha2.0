// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, User } from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { RequestInternal } from "next-auth";


declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    phone?: string | null;
    city?: string | null;
    about?: string | null;
    avatar?: string| null;
    isOrganizer?: boolean;
    organizationName?: string| null;
    organizationCity?: string| null;
    mainDanceStyle?: any| null;
    additionalStyles?: any[]| null;
    danceSchool?: any| null;
    organizationStyle?: any;
  }
  interface Session {
    user: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    city?: string;
    about?: string;
    avatar?: string;
    isOrganizer?: boolean;
    organizationName?: string;
    organizationCity?: string;
    mainDanceStyle?: any;
    additionalStyles?: any[];
    danceSchool?: any;
    organizationStyle?: any;
  }
}
// Расширяем стандартный интерфейс User от NextAuth
interface CustomUser extends User {
  fullName?: string;
  role?: UserRole;
  isOrganizer?: boolean;
  phone?: string;
  city?: string;
  about?: string;
  avatar?: string;
  organizationName?: string;
  organizationCity?: string;
  mainDanceStyle?: any;
  additionalStyles?: any[];
  danceSchool?: any;
  organizationStyle?: any;
}

