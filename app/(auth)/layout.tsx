import Header from "@/shared/components/shared/header";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Авторизация",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="flex flex-col w-full ">
                {children}
            </main>
        </div>
    );
}