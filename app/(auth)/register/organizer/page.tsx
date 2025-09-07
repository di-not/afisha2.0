// app/(auth)/register/organizer/page.tsx
'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/app/(root)/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/shared/components/ui/passwordInput";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Yandex from "@/public/images/yandex.svg";

const schema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  fullName: z.string().min(2, "Имя должно быть не менее 2 символов"),
  phone: z.string().optional(),
  organizationName: z.string().min(2, "Название организации обязательно"),
  organizationCity: z.string().min(2, "Город организации обязателен"),
});

export default function OrganizerRegistrationPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await registerUser({ ...data, isOrganizer: true });
      
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        router.push("/login?message=registration_success");
      }
    } catch (error) {
      setError("Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Регистрация организатора</h2>
          <p className="mt-2 text-gray-600">Создайте аккаунт для организации мероприятий</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <input
            {...form.register("fullName")}
            placeholder="ФИО"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
          <input
            {...form.register("phone")}
            placeholder="Телефон"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            {...form.register("organizationName")}
            placeholder="Название организации/школы"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            {...form.register("organizationCity")}
            placeholder="Город организации"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bgButton py-3 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться как организатор"}
          </button>
        </form>

        <div className="w-full my-4 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">или</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={() => signIn("yandex", { callbackUrl: "/profile" })}
          className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <Yandex width={20} height={20} />
          <span>Войти через Яндекс</span>
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-(--primary) hover:underline">
              Войти
            </Link>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Обычный пользователь?{" "}
            <Link href="/register/user" className="text-(--primary) hover:underline">
              Регистрация участника
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}