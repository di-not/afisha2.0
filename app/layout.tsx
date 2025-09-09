
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers  from "@/shared/components/shared/providers";

const montserrat = Montserrat({
    subsets: ["cyrillic"],
    variable: "--font-base",
});

export const metadata: Metadata = {
    title: "",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${montserrat.variable} antialiased font-[family-name:var(--font-base)]`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
