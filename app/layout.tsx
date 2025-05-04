
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers  from "@/shared/components/shared/providers";
// import ReduxProvider from "@/shared/redux/ReduxProvider/ReduxProvider";

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
            <body className={`${montserrat.variable} antialiased `}>
                <Providers>
                    {/* <ReduxProvider> */}
                    {children}

                    {/* </ReduxProvider> */}
                </Providers>
            </body>
        </html>
    );
}
