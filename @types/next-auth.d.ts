// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions, User } from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { RequestInternal } from "next-auth";

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

// Вспомогательная функция для преобразования null в undefined
const normalizeUser = (user: any): CustomUser => ({
  id: user.id,
  email: user.email,
  name: user.fullName || user.name || "User",
  fullName: user.fullName || user.name || "User",
  role: user.role,
  isOrganizer: user.isOrganizer || false,
  phone: user.phone || undefined,
  city: user.city || undefined,
  about: user.about || undefined,
  avatar: user.avatar || undefined,
  organizationName: user.organizationName || undefined,
  organizationCity: user.organizationCity || undefined,
});

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
      async profile(profile: YandexProfile): Promise<CustomUser> {
        return {
          id: String(profile.id),
          email: profile.default_email || `${profile.id}@yandex.ru`,
          name: profile.display_name || profile.real_name || `User${profile.id}`,
          fullName: profile.display_name || profile.real_name || `User${profile.id}`,
          role: "USER",
        };
      },
    }),
    // Провайдер для входа танцоров
    CredentialsProvider({
      id: "dancer-credentials",
      name: "DancerCredentials",
      credentials: {
        email: { type: "text", label: "email" },
        password: { type: "password", label: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">): Promise<CustomUser | null> {
        if (!credentials) return null;

        try {
          // Ищем пользователя с email и ролью ТАНЦОР
          const findUser = await prisma.user.findFirst({
            where: { 
              AND: [
                { email: credentials.email },
                { role: "USER" }
              ]
            },
          });

          if (!findUser) {
            throw new Error("Аккаунт танцора с таким email не найден");
          }

          const isPasswordValid = await compare(
            credentials.password,
            findUser.password
          );

          if (!isPasswordValid) {
            throw new Error("Неверный пароль");
          }

          return normalizeUser({
            id: String(findUser.id),
            email: findUser.email,
            fullName: findUser.fullName,
            role: findUser.role,
            isOrganizer: findUser.isOrganizer,
            phone: findUser.phone,
            city: findUser.city,
            about: findUser.about,
            avatar: findUser.avatar,
          });
        } catch (error) {
          console.error("Dancer authorize error:", error);
          throw error;
        }
      },
    }),
    // Провайдер для входа организаторов
    CredentialsProvider({
      id: "organizer-credentials",
      name: "OrganizerCredentials",
      credentials: {
        email: { type: "text", label: "email" },
        password: { type: "password", label: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">): Promise<CustomUser | null> {
        if (!credentials) return null;

        try {
          // Ищем пользователя с email и ролью ОРГАНИЗАТОР
          const findUser = await prisma.user.findFirst({
            where: { 
              AND: [
                { email: credentials.email },
                { role: "ORGANIZER" }
              ]
            },
          });

          if (!findUser) {
            throw new Error("Аккаунт организатора с таким email не найден");
          }

          const isPasswordValid = await compare(
            credentials.password,
            findUser.password
          );

          if (!isPasswordValid) {
            throw new Error("Неверный пароль");
          }

          return normalizeUser({
            id: String(findUser.id),
            email: findUser.email,
            fullName: findUser.fullName,
            role: findUser.role,
            isOrganizer: findUser.isOrganizer,
            phone: findUser.phone,
            city: findUser.city,
            about: findUser.about,
            avatar: findUser.avatar,
            organizationName: findUser.organizationName,
            organizationCity: findUser.organizationCity,
          });
        } catch (error) {
          console.error("Organizer authorize error:", error);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      try {
        // Для входа по credentials пропускаем проверку
        if (account?.provider === "dancer-credentials" || account?.provider === "organizer-credentials") {
          return true;
        }
        
        // Для OAuth провайдеров (Яндекс)
        if (account?.provider === "yandex") {
          if (!user.email) {
            console.error("No email in user profile");
            return false;
          }

          // Ищем пользователя по providerId (если уже логинился через Яндекс)
          const findUser = await prisma.user.findFirst({
            where: {
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          });

          if (findUser) {
            // Обновляем данные провайдера
            await prisma.user.update({
              where: { id: findUser.id },
              data: {
                provider: account.provider,
                providerId: account.providerAccountId,
                fullName: (user as CustomUser).fullName || user.name || findUser.fullName,
              },
            });
            return true;
          }

          // Создаем нового пользователя для OAuth (по умолчанию как танцора)
          await prisma.user.create({
            data: {
              fullName: (user as CustomUser).fullName || user.name || "User",
              email: user.email!,
              role: "USER" as UserRole,
              password: hashSync(Math.random().toString(36) + Date.now().toString(), 10),
              provider: account.provider,
              providerId: account.providerAccountId,
              isOrganizer: false,
            },
          });

          return true;
        }

        return false;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      // Первый вызов при signIn
      if (user) {
        const customUser = user as CustomUser;
        return {
          ...token,
          id: customUser.id,
          email: customUser.email,
          fullName: customUser.fullName || customUser.name,
          role: customUser.role,
          isOrganizer: customUser.isOrganizer || false,
          phone: customUser.phone || undefined,
          city: customUser.city || undefined,
          about: customUser.about || undefined,
          avatar: customUser.avatar || undefined,
          organizationName: customUser.organizationName || undefined,
          organizationCity: customUser.organizationCity || undefined,
        };
      }

      // При обновлении сессии из клиента
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      // Для последующих вызовов получаем актуальные данные из БД
      if (!token.email || !token.role) return token;

      try {
        const findUser = await prisma.user.findFirst({
          where: { 
            AND: [
              { email: token.email as string },
              { role: token.role as UserRole }
            ]
          },
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
          console.error("User not found for email:", token.email, "and role:", token.role);
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
          organizationName: findUser.organizationName || undefined,
          organizationCity: findUser.organizationCity || undefined,
          mainDanceStyle: findUser.mainDanceStyle || undefined,
          additionalStyles: findUser.additionalStyles.map(as => as.danceStyle),
          danceSchool: findUser.danceSchool || undefined,
          organizationStyle: findUser.organizationStyle || undefined,
        };
      } catch (error) {
        console.error("JWT error:", error);
        return { ...token, error: "DB_ERROR" };
      }
    },

    async session({ session, token }) {
      if (token.invalid || token.error) {
        // Возвращаем сессию без user если токен невалиден
        const { user, ...rest } = session;
        return rest;
      }

      const customToken = token as any;

      return {
        ...session,
        user: {
          ...session.user,
          id: customToken.id as string,
          email: customToken.email as string,
          name: customToken.fullName as string,
          fullName: customToken.fullName as string,
          role: customToken.role as UserRole,
          phone: customToken.phone as string | undefined,
          city: customToken.city as string | undefined,
          about: customToken.about as string | undefined,
          avatar: customToken.avatar as string | undefined,
          isOrganizer: customToken.isOrganizer as boolean | undefined,
          organizationName: customToken.organizationName as string | undefined,
          organizationCity: customToken.organizationCity as string | undefined,
          mainDanceStyle: customToken.mainDanceStyle as any,
          additionalStyles: customToken.additionalStyles as any,
          danceSchool: customToken.danceSchool as any,
          organizationStyle: customToken.organizationStyle as any,
        },
      };
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
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
    async createUser(message) {
      console.log("User created", message);
    },
    async linkAccount(message) {
      console.log("Account linked", message);
    },
    async session(message) {
      console.log("Session active", message);
    },
  },

  // Настройки debug
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };