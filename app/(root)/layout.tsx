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
        <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pt-0 pb-20 sm:font-[family-name:var(--font-base)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm: w-full max-w-[1480px]">
                {children}
            </main>
        </div>
    );
}
