import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';
import type { UserRole } from '@prisma/client';
// types/next-auth.d.ts
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    fullName: string;
    email: string;
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

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    fullName?: string;
    email?: string;
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
    invalid?: boolean;
    error?: string;
  }
}

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }


declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
  }
}