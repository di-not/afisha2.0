// hooks/useTypedSession.ts
'use client'
import { useSession } from "next-auth/react";

export const useTypedSession = () => {
  const { data: session, status, update } = useSession();
  
  return {
    session: session as {
      user: {
        id: string;
        role: string;
        fullName: string;
        email: string;
        phone?: string;
        city?: string;
        about?: string;
        avatar?: string;
        isOrganizer?: boolean;
        organizationName?: string;
        organizationCity?: string;
        mainDanceStyle?: {
          id: string;
          name: string;
          description?: string;
        };
        additionalStyles?: Array<{
          id: string;
          name: string;
          description?: string;
        }>;
        danceSchool?: {
          id: string;
          name: string;
          city: string;
          description?: string;
        };
        organizationStyle?: {
          id: string;
          name: string;
          description?: string;
        };
      };
    } | null,
    status,
    update
  };
};