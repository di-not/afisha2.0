// app/(auth)/login/dancer/page.tsx
'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/shared/components/ui/passwordInput";
import { useState, useEffect } from "react";
import Yandex from "@/public/images/yandex.svg";

const schema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});

export default function DancerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [yandexLoading, setYandexLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const errorParam = searchParams?.get('error');
    const yandexParam = searchParams?.get('yandex');
    
    if (errorParam) {
      switch (errorParam) {
        case 'CredentialsSignin':
          setError("Неверный email или пароль");
          break;
        case 'OAuthAccountNotLinked':
          setError("Аккаунт Яндекс уже привязан к другому email");
          break;
        default:
          setError("Ошибка входа");
      }
    }

    // Автоматический вход через Яндекс если передан параметр
    if (yandexParam === 'true') {
      handleYandexLogin();
    }
  }, [searchParams]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await signIn("dancer-credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Неверный email или пароль");
      } else if (res?.ok) {
        router.push("/profile");
      }
    } catch (error) {
      setError("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleYandexLogin = async () => {
    setYandexLoading(true);
    setError("");
    
    try {
      await signIn("yandex", { 
        callbackUrl: "/profile",
        redirect: true 
      });
    } catch (error) {
      setError("Ошибка входа через Яндекс");
      setYandexLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Link href="/login" className="inline-block mb-4 text-blue-500 hover:underline">
            ← Назад к выбору входа
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Вход как Танцор</h2>
          <p className="mt-2 text-gray-600">Введите данные для входа в аккаунт танцора</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <input
            {...form.register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <PasswordInput
            formStates={form}
            name="password"
            placeholder="Пароль"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Вход..." : "Войти как Танцор"}
          </button>
        </form>

        <div className="w-full my-4 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">или</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleYandexLogin}
          disabled={yandexLoading}
          className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <Yandex width={20} height={20} />
          <span>{yandexLoading ? "Вход..." : "Войти через Яндекс"}</span>
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Нет аккаунта танцора?{" "}
            <Link href="/register/user" className="text-blue-500 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Хотите войти как организатор?{" "}
            <Link href="/login/organizer" className="text-blue-500 hover:underline">
              Вход для организаторов
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}