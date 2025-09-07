// app/(auth)/login/page.tsx
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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [yandexLoading, setYandexLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const message = searchParams.get('message');
    const error = searchParams.get('error');
    
    if (message === 'registration_success') {
      setError("Регистрация успешна! Теперь вы можете войти.");
    }
    
    if (error === 'OAuthAccountNotLinked') {
      setError("Аккаунт Яндекс уже привязан к другому email. Войдите через Яндекс или используйте другой способ входа.");
    }
    
    if (error === 'OAuthSignin' || error === 'OAuthCallback') {
      setError("Ошибка входа через Яндекс. Попробуйте еще раз.");
    }
  }, [searchParams]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await signIn("credentials", {
        ...data,
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
          <h2 className="text-3xl font-bold text-gray-900">Вход в аккаунт</h2>
          <p className="mt-2 text-gray-600">Введите ваши данные для входа</p>
        </div>

        {error && (
          <div className={`px-4 py-3 rounded-lg ${
            error.includes("успешна") 
              ? "bg-green-50 border border-green-200 text-green-600" 
              : "bg-red-50 border border-red-200 text-red-600"
          }`}>
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
            className="w-full bgButton py-3 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Вход..." : "Войти"}
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
            Нет аккаунта?{" "}
            <Link href="/register/user" className="text-(--primary) hover:underline">
              Регистрация участника
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Хотите создавать мероприятия?{" "}
            <Link href="/register/organizer" className="text-(--primary) hover:underline">
              Регистрация организатора
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}