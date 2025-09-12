"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
    <div className="min-h-screen flex items-center justify-center bgGradient py-12 px-4">
      <div className="w-full space-y-8 p-8 bg-white rounded-4xl shadow-lg bgPrimary max-w-[480px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Вход в аккаунт</h2>
          <p className="mt-2 text-white">Выберите тип аккаунта для входа</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

        <div className="space-y-3 mb-0">
          <Link href="/login/dancer" className="w-full bgButton p-3 font-semibold">
            Войти как Танцор
          </Link>

          {/* Кнопка входа как организатор */}
          <Link href="/login/organizer" className="w-full bgButton p-3 font-semibold">
            Войти как Организатор
          </Link>
        </div>

        <div className="w-full my-4 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-white">или</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="flex flex-col gap-2">
          {/* Яндекс вход для танцора */}
          <button onClick={handleYandexDancer} className="w-full bgButton p-3 font-semibold gap-2">
            <span>Войти через</span>
            <img src={"images/yandex.svg"} alt="" className="w-6 h-6" />

            <span> (Танцор)</span>
          </button>

          {/* Яндекс вход для организатора */}
          <button onClick={handleYandexOrganizer} className="w-full bgButton p-3 font-semibold gap-2">
            <span>Войти через</span>
            <img src={"images/yandex.svg"} alt="" className="w-6 h-6" />

            <span> (Организатор)</span>
          </button>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-white ">
            Нет аккаунта?
            <Link href="/register/user" className="pl-1 text-[var(--primary)] hover:underline">
              Регистрация участника
            </Link>
          </p>
          <p className="text-sm text-white">
            Хотите создавать мероприятия?{" "}
            <Link href="/register/organizer" className="pl-1 text-[var(--primary)] hover:underline">
              Регистрация организатора
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
