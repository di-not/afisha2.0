// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Интерфейс для профиля Яндекс
interface YandexProfile {
  id: string;
  login: string;
  client_id: string;
  display_name?: string;
  real_name?: string;
  first_name?: string;
  last_name?: string;
  sex?: string;
  default_email?: string;
  emails?: string[];
  default_phone?: {
    id: number;
    number: string;
  };
  is_avatar_empty?: boolean;
}

export const authOptions: AuthOptions = {
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID || "",
      clientSecret: process.env.YANDEX_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "login:email login:info",
        },
      },
      profile(profile: YandexProfile) {
        return {
          id: String(profile.id),
          email: profile.default_email || `${profile.id}@yandex.ru`,
          fullName: profile.display_name || profile.real_name || `User${profile.id}`,
          role: "USER" as UserRole,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text", label: "email" },
        password: { type: "text", label: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const findUser = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          if (!findUser) return null;

          const isPasswordValid = await compare(
            credentials.password,
            findUser.password
          );

          if (!isPasswordValid) return null;

          return {
            id: String(findUser.id),
            email: findUser.email,
            fullName: findUser.fullName,
            role: findUser.role,
            isOrganizer: findUser.isOrganizer,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Для входа по credentials пропускаем
        if (account?.provider === "credentials") return true;
        
        if (!user.email) {
          console.error("No email in user profile");
          return false;
        }

        // Для OAuth провайдеров (Яндекс)
        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              // Ищем по providerId (если пользователь уже логинился через этот провайдер)
              { 
                provider: account?.provider, 
                providerId: account?.providerAccountId 
              },
              // Ищем по email (разрешаем одинаковые почты для разных ролей)
              { 
                email: user.email,
                // НЕ фильтруем по провайдеру, чтобы разрешить одинаковые почты
              },
            ],
          },
        });

        if (findUser) {
          // Обновляем провайдер если пользователь уже существует
          await prisma.user.update({
            where: { id: findUser.id },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
              // Сохраняем оригинальную роль пользователя
            },
          });
          return true;
        }

        // Создаем нового пользователя для OAuth
        // Для OAuth пользователей по умолчанию создаем как обычного пользователя
        // Они смогут стать организаторами через верификацию позже
        await prisma.user.create({
          data: {
            fullName: user.name || "User",
            email: user.email,
            role: "USER" as UserRole, // По умолчанию обычный пользователь
            password: hashSync(Math.random().toString(36) + Date.now().toString(), 10),
            provider: account?.provider,
            providerId: account?.providerAccountId,
            isOrganizer: false, // По умолчанию не организатор
          },
        });

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      // Первый вызов при signIn
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isOrganizer: (user as any).isOrganizer || false,
        };
      }

      // При обновлении сессии из клиента
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      // Для последующих вызовов получаем актуальные данные из БД
      if (!token.email) return token;

      try {
        const findUser = await prisma.user.findFirst({
          where: { email: token.email },
          include: {
            mainDanceStyle: true,
            additionalStyles: { 
              include: { 
                danceStyle: true 
              } 
            },
            danceSchool: true,
            organizationStyle: true,
          }
        });
        
        if (!findUser) {
          return { ...token, invalid: true };
        }

        return {
          ...token,
          id: String(findUser.id),
          email: findUser.email,
          fullName: findUser.fullName,
          role: findUser.role,
          isOrganizer: findUser.isOrganizer,
          phone: findUser.phone || undefined,
          city: findUser.city || undefined,
          about: findUser.about || undefined,
          avatar: findUser.avatar || undefined,
          mainDanceStyle: findUser.mainDanceStyle || undefined,
          additionalStyles: findUser.additionalStyles.map(as => as.danceStyle),
          danceSchool: findUser.danceSchool || undefined,
          organizationName: findUser.organizationName || undefined,
          organizationCity: findUser.organizationCity || undefined,
          organizationStyle: findUser.organizationStyle || undefined,
        };
      } catch (error) {
        console.error("JWT error:", error);
        return { ...token, error: "DB_ERROR" };
      }
    },

    session({ session, token }) {
      if (token.invalid || token.error) {
        // Возвращаем сессию без user если токен невалиден
        const { user, ...rest } = session;
        return rest;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          fullName: token.fullName as string,
          role: token.role as UserRole,
          phone: token.phone as string | undefined,
          city: token.city as string | undefined,
          about: token.about as string | undefined,
          avatar: token.avatar as string | undefined,
          isOrganizer: token.isOrganizer as boolean | undefined,
          organizationName: token.organizationName as string | undefined,
          organizationCity: token.organizationCity as string | undefined,
          mainDanceStyle: token.mainDanceStyle as any,
          additionalStyles: token.additionalStyles as any,
          danceSchool: token.danceSchool as any,
          organizationStyle: token.organizationStyle as any,
        },
      };
    },
  },

  // Обработка ошибок
  events: {
    async signIn(message) {
      console.log("Sign in successful", message);
    },
    async signOut(message) {
      console.log("Sign out successful", message);
    },
    
  },

  // Настройки debug
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };