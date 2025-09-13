"use client";
import Header from "@/shared/components/shared/header";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ProtectedRoute from "@/shared/components/auth/protected-roue";
import { IconProfile } from "@/shared/icons/profile";
import { IconSettings } from "@/shared/icons/settings";
import { IconEvents } from "@/shared/icons/events";
import { IconInterests } from "@/shared/icons/interests";
import { IconCookie } from "@/shared/icons/cookie";
import { IconBolt } from "@/shared/icons/bolt";
import { IconBell } from "@/shared/icons/bell";
import { IconGraduationCap } from "@/shared/icons/graduation-cap";
import { IconMoney } from "@/shared/icons/money";

const USER_NAVIGATION = [
  { text: "Личная информация", link: "/profile", icon:<IconProfile className="size-[24px]"/> },
  { text: "Настройки профиля танцора", link: "/profile/dancer", icon:  <IconSettings className="size-[24px]"/>},
  { text: "Настройки интересов", link: "/profile/interests", icon: <IconInterests className="size-[24px]"/> },
  { text: "Мероприятия", link: "/profile/events", icon: <IconEvents className="size-[24px]"/> },
  { text: "Правовая информация", link: "/profile/legal", icon: <IconCookie className="size-[24px]"/> },
  { text: "Поддержка и обратная связь", link: "/profile/support", icon: <IconBell className="size-[24px]"/> },
];

const ORGANIZER_NAVIGATION = [
  { text: "Личная информация", link: "/profile", icon:<IconProfile className="size-[24px]"/> },
  { text: "Информация об организации", link: "/profile/organization", icon: <IconSettings className="size-[24px]"/> },
  { text: "Мои мероприятия", link: "/profile/my-events", icon: <IconBolt className="size-[24px]"/> },
  { text: "Создать мероприятие", link: "/profile/create-event", icon: "➕" },
  { text: "Правовая информация", link: "/profile/legal", icon: <IconCookie className="size-[24px]"/> },
  { text: "Поддержка и обратная связь", link: "/profile/support", icon: <IconBell className="size-[24px]"/> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const isOrganizer = session?.user?.role === "ORGANIZER";
  const navigation = isOrganizer ? ORGANIZER_NAVIGATION : USER_NAVIGATION;

  return (
    <ProtectedRoute>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-15">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Боковое меню */}
          <div className="lg:w-64 bg-white rounded-2xl shadow-lg p-6 h-fit">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Личный кабинет</h2>
              <p className="text-sm text-gray-600 mt-1">{isOrganizer ? "Организатор" : "Участник"}</p>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    pathname === item.link ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <Link
                href="/profile/ur-info"
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <IconGraduationCap className="size-[24px]"/>
                <span className="text-sm">Юр. информация</span>
              </Link>

              <Link
                href="/profile/requisites"
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <IconMoney className="size-[24px]"/>
                <span className="text-sm">Реквизиты</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
