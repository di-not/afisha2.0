import Header from "@/shared/components/shared/header";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Главная",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen  pb-20">
            <Header />
            <main className="flex flex-col w-full pt-10">
                {children}
            </main>
        </div>
    );
}