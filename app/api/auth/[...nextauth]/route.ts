import NextAuth from "next-auth";

import YandexProvider from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@prisma/client";

export const authOptions = {
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID || "",
            clientSecret: process.env.YANDEX_CLIENT_SECRET || "",
            profile(profile) {
                console.log(profile)
                
                return {
                    id: String(profile.id),
                    email: profile.default_email,
                    fullName: profile.display_name,
                    role: "USER" as UserRole,
                };
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    type: "text",
                    label: "email",
                },
                password: {
                    type: "text",
                    label: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                const values = {
                    email: credentials.email,
                    password: credentials.password,
                };
                const findUser = await prisma?.user.findFirst({
                    where: values,
                });
                if (!findUser) {
                    return null;
                }

                // const isPasswordValid = await compare(
                //     credentials.password,
                //     findUser.password
                // );
                const isPasswordValid =
                    credentials.password === findUser.password;
                if (!isPasswordValid) {
                    return null;
                }
                return {
                    id: String(findUser.id),
                    email: findUser.email,
                    fullName: findUser.fullName,
                    role: "USER" as UserRole,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }: any) {
            try {
                if (account?.provider === "credentials") {
                    return true;
                }
                if (!user.email) {
                    return false;
                }
                const findUser = await prisma?.user.findFirst({
                    where: {
                        OR: [
                            {
                                provider: account?.provider,
                                providerId: account?.providerAccountId,
                            },
                            { email: user.email },
                        ],
                    },
                });
                if (findUser) {
                    await prisma?.user.update({
                        where: {
                            id: findUser.id,
                        },
                        data: {
                            provider: account.provider,
                            providerId: account?.providerAccountId,
                        },
                    });
                    return true;
                }

                await prisma?.user.create({
                    data: {
                        fullName: user.fullName,
                        email: user.email,
                        role: "USER" as UserRole,
                        //поменять (не безопасно)
                        password: hashSync(user.id.toString(), 10),
                        provider: account?.provider,
                        providerId: account?.providerAccountId,
                    },
                });
            } catch (error) {
                console.error("Error signIn", error);
            }
        },
        async jwt({ token }: any) {
            const findUser = await prisma?.user.findFirst({
                where: {
                    email: token.email,
                },
            });
            if (findUser) {
                token.id = String(findUser.id);
                token.email = findUser.email;
                token.fullName = findUser.fullName;
                token.role = "USER" as UserRole;
            }

            return token;
        },
        session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
