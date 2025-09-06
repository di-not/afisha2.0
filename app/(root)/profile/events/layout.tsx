"use client";

import { usePathname, useRouter } from "next/navigation";

const TABS = [
        {
                text: "Понравившиеся",
                link: "/profile/events/favorite",
        },
        {
                text: "Закладки",
                link: "/profile/events/bookmarks",
        },
        {
                text: "Я собираюсь",
                link: "/profile/events/gonnago",
        },
        {
                text: "Я пойду",
                link: "/profile/events/willgo",
        },
];

export default function Layout({
        children,
}: Readonly<{
        children: React.ReactNode;
}>) {
        const router = useRouter();
        const pathname = usePathname();
        return (
                <div>
                        <div className="flex gap-4">
                                <div className="flex justify-between bg-gray-400 p-2 rounded-2xl px-8 w-full gap-6 flex-1">
                                        {TABS.map((e, i) => (
                                                <button
                                                        className={` rounded-3xl p-2 w-full text-center ${pathname === e.link ? 'bgButton ':'bg-white'}`}
                                                        onClick={() => {
                                                            console.log(pathname,e.link)
                                                            
                                                                router.push(e.link);
                                                        }}
                                                >
                                                        {e.text}
                                                </button>
                                        ))}
                                </div>
                                <button className="bgButton text-[36px] rounded-full size-[56px] justify-center items-center text-center flex pb-2 ">
                                        +
                                </button>
                        </div>
                        <>{children}</>
                </div>
        );
}
