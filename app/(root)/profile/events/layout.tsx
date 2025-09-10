"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const TABS = [
  {
    text: "Понравившиеся",
    link: "/profile/events/favorite",
    key: "favorite"
  },
  {
    text: "Закладки",
    link: "/profile/events/bookmarks",
    key: "bookmarks"
  },
  {
    text: "Я собираюсь",
    link: "/profile/events/gonnago",
    key: "gonnago"
  },
  {
    text: "Я пойду",
    link: "/profile/events/willgo",
    key: "willgo"
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    return TABS.find(tab => pathname === tab.link)?.key || "favorite";
  };

  const activeTab = getActiveTab();

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="flex justify-between bg-gray-100 p-2 rounded-2xl px-4 w-full gap-2 flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`rounded-3xl p-3 w-full text-center text-sm font-medium transition-colors ${
                activeTab === tab.key 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                router.push(tab.link);
              }}
            >
              {tab.text}
            </button>
          ))}
        </div>
        
        <Link 
          href="/event/create"
          className="bg-blue-500 text-white text-2xl rounded-full size-12 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
          title="Создать мероприятие"
        >
          +
        </Link>
      </div>
      
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}