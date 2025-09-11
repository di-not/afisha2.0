// app/(auth)/login/organizer/page.tsx
'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/shared/components/ui/passwordInput";
import { useState, useEffect } from "react";

const schema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});

export default function OrganizerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const errorParam = searchParams?.get('error');
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
  }, [searchParams]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await signIn("organizer-credentials", {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Link href="/login" className="inline-block mb-4 text-blue-500 hover:underline">
            ← Назад к выбору входа
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Вход как Организатор</h2>
          <p className="mt-2 text-gray-600">Введите данные для входа в аккаунт организатора</p>
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
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Вход..." : "Войти как Организатор"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Нет аккаунта организатора?{" "}
            <Link href="/register/organizer" className="text-blue-500 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Хотите войти как танцор?{" "}
            <Link href="/login/dancer" className="text-blue-500 hover:underline">
              Вход для танцоров
            </Link>
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
          <strong>Внимание:</strong> Для входа через Яндекс используйте вход как танцор, 
          затем в настройках профиля можно будет получить права организатора.
        </div>
      </div>
    </div>
  );
}