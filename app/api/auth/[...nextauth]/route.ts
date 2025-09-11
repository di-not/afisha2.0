import NextAuth, { AuthOptions } from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hashSync } from "bcrypt";
import { User, UserRole } from "@prisma/client";
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

// Вспомогательная функция для преобразования
const normalizeUser = (user: User): User => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isOrganizer: user.isOrganizer || false,
  phone: user.phone || null,
  city: user.city || null,
  about: user.about || null,
  avatar: user.avatar || null,
  organizationName: user.organizationName || null,
  organizationCity: user.organizationCity || null,
  fullName: user.fullName,
  password: "",
  mainDanceStyleId: user.mainDanceStyleId,
  danceSchoolId: user.danceSchoolId,
  organizationStyleId: user.organizationCity,
  provider: user.provider,
  providerId: user.provider,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
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
      profile(profile: YandexProfile) {
        return {
          id: String(profile.id),
          email: profile.default_email || `${profile.id}@yandex.ru`,
          name: profile.display_name || profile.real_name || `User${profile.id}`,
          role: "USER" as UserRole,
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
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Promise<User | null> {
        if (!credentials) return null;

        try {
          // Ищем пользователя с email и ролью ТАНЦОР
          const findUser = await prisma.user.findFirst({
            where: {
              AND: [{ email: credentials.email }, { role: "USER" }],
            },
          });

          if (!findUser) {
            return null;
          }

          const isPasswordValid = await compare(credentials.password, findUser.password);

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
            password: "",
            mainDanceStyleId: findUser.mainDanceStyleId,
            danceSchoolId: findUser.danceSchoolId,
            organizationName: findUser.organizationName,
            organizationCity: findUser.organizationCity,
            organizationStyleId: findUser.organizationStyleId,
            provider: findUser.provider,
            providerId: findUser.providerId,
            createdAt: findUser.createdAt,
            updatedAt: findUser.updatedAt,
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
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Promise<User | null> {
        if (!credentials) return null;

        try {
          // Ищем пользователя с email и ролью ОРГАНИЗАТОР
          const findUser = await prisma.user.findFirst({
            where: {
              AND: [{ email: credentials.email }, { role: "ORGANIZER" }],
            },
          });

          if (!findUser) {
            throw new Error("Аккаунт организатора с таким email не найден");
          }

          const isPasswordValid = await compare(credentials.password, findUser.password);

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
            password: "",
            mainDanceStyleId: findUser.mainDanceStyleId,
            danceSchoolId: findUser.danceSchoolId,
            organizationStyleId: findUser.organizationStyleId,
            provider: findUser.provider,
            providerId: findUser.providerId,
            createdAt: findUser.createdAt,
            updatedAt: findUser.updatedAt,
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
    signIn: "/login",
    error: "/login",
    signOut: "/",
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
                fullName: user.name || findUser.fullName,
              },
            });
            return true;
          }

          // Создаем нового пользователя для OAuth (по умолчанию как танцора)
          await prisma.user.create({
            data: {
              fullName: user.name || "User",
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
        return {
          ...token,
          id: (user as any).id,
          email: user.email,
          fullName: (user as any).fullName || user.name,
          role: (user as any).role,
          isOrganizer: (user as any).isOrganizer || false,
          phone: (user as any).phone || undefined,
          city: (user as any).city || undefined,
          about: (user as any).about || undefined,
          avatar: (user as any).avatar || undefined,
          organizationName: (user as any).organizationName || undefined,
          organizationCity: (user as any).organizationCity || undefined,
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
            AND: [{ email: token.email as string }, { role: token.role as UserRole }],
          },
          include: {
            mainDanceStyle: true,
            additionalStyles: {
              include: {
                danceStyle: true,
              },
            },
            danceSchool: true,
            organizationStyle: true,
          },
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
          additionalStyles: findUser.additionalStyles.map((as) => as.danceStyle),
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

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.fullName as string,
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
