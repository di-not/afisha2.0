"use client";
import Header from "@/shared/components/shared/header";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVIGATION_LIST = [
        {
                text: "Личная информация",
                link: "/profile",
        },
        {
                text: "Мероприятия",
                link: "/profile/events",
        },
        {
                text: "Связь с тп",
                link: "/profile/tp",
        },
];
export default function Layout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        const pathname = usePathname();
        return (
                <>
                        <Header />
                        <div className="container h-[calc(100vh_-130px)]">
                                <div className="flex gap-6 mt-10 h-full">
                                        <ul className="flex flex-col gap-4 w-[340px] bg-gray-200 p-4 rounded-2xl h-full">
                                                {NAVIGATION_LIST.map((e, i) => (
                                                        <Link
                                                                key={i}
                                                                href={e.link}
                                                                className={`${
                                                                        pathname.includes(e.link) &&
                                                                        e.link !== "/profile" &&
                                                                        "text-blue-500"
                                                                }`}
                                                        >
                                                                {e.text}
                                                        </Link>
                                                ))}
                                                <div className="mt-auto flex flex-col gap-2">
                                                        <Link href={"/profile/ur-inf"}>Юр. информация</Link>
                                                        <Link href={"/profile/ur-inf"}>Реквизиты</Link>
                                                        <button className="bgButton w-full p-2 text-md">
                                                                Верификация
                                                        </button>
                                                        <button className="bgButton w-full p-2 text-md">Выйти</button>
                                                </div>
                                        </ul>

                                        <div className="w-full">{children}</div>
                                </div>
                        </div>
                </>
        );
}
