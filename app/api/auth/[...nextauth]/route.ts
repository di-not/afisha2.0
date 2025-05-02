import NextAuth from "next-auth";

import YandexProvider from "next-auth/providers/yandex";

export const authOptions = {
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID || "",
            clientSecret: process.env.YANDEX_CLIENT_SECRET || "",
        }),
    ],
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
