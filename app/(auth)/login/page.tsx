"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Yandex from "@/public/images/yandex.svg";
import { signIn } from "next-auth/react";

export default function LoginSelectionPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "CredentialsSignin":
          setError("Неверный email или пароль");
          break;
        case "OAuthAccountNotLinked":
          setError("Аккаунт Яндекс уже привязан к другому email");
          break;
        default:
          setError("Ошибка входа");
      }
    }
  }, [searchParams]);

  const handleYandexDancer = () => signIn("yandex-dancer", { callbackUrl: "/profile" });
  const handleYandexOrganizer = () => signIn("yandex-organizer", { callbackUrl: "/profile" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Вход в аккаунт</h2>
          <p className="mt-2 text-gray-600">Выберите тип аккаунта для входа</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

        <div className="space-y-4">
          {/* Кнопка входа как танцор */}
          <Link
            href="/login/dancer"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">💃</span>
            Войти как Танцор
          </Link>

          {/* Кнопка входа как организатор */}
          <Link
            href="/login/organizer"
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🎪</span>
            Войти как Организатор
          </Link>
        </div>

        <div className="w-full my-4 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">или</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Яндекс вход для танцора */}
        <button
          onClick={handleYandexDancer}
          className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors mb-3"
        >
          <Yandex width={20} height={20} />
          <span>Войти через Яндекс (Танцор)</span>
        </button>

        {/* Яндекс вход для организатора */}
        <button
          onClick={handleYandexOrganizer}
          className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <Yandex width={20} height={20} />
          <span>Войти через Яндекс (Организатор)</span>
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Нет аккаунта?{" "}
            <Link href="/register/user" className="text-blue-500 hover:underline">
              Регистрация участника
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Хотите создавать мероприятия?{" "}
            <Link href="/register/organizer" className="text-blue-500 hover:underline">
              Регистрация организатора
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
