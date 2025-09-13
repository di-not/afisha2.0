// @types/next-auth.d.ts
import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    fullName: string;
    role: UserRole;
    isOrganizer?: boolean;
    phone?: string | null;
    city?: string | null;
    about?: string | null;
    avatar?: string | null;
    organizationName?: string | null;
    organizationCity?: string | null;
    provider?: string | null;
    providerId?: string | null;
    mainDanceStyle?: any | null;
    additionalStyles?: any[] | null;
    danceSchool?: any | null;
    organizationStyle?: any | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      fullName: string;
      role: UserRole;
      isOrganizer?: boolean;
      phone?: string | null;
      city?: string | null;
      about?: string | null;
      avatar?: string | null;
      organizationName?: string | null;
      organizationCity?: string | null;
      provider?: string | null;
      providerId?: string | null;
      mainDanceStyle?: any | null;
      additionalStyles?: any[] | null;
      danceSchool?: any | null;
      organizationStyle?: any | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    fullName: string;
    role: UserRole;
    isOrganizer?: boolean;
    phone?: string;
    city?: string;
    about?: string;
    avatar?: string;
    organizationName?: string;
    organizationCity?: string;
    provider?: string;
    providerId?: string;
    mainDanceStyle?: any;
    additionalStyles?: any[];
    danceSchool?: any;
    organizationStyle?: any;
  }
}