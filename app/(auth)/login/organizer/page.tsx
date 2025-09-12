"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/shared/components/ui/passwordInput";
import { useState, useEffect } from "react";
import Yandex from "@/public/images/yandex.svg";
import { Input } from "@/shared/components/ui/input";
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
    <div className="min-h-screen flex items-center justify-center bgGradient py-12 px-4">
      <div className="w-full space-y-8 p-8 bg-white rounded-4xl shadow-lg bgPrimary max-w-[480px]">
        <div className="text-center">
          <Link href="/login" className="inline-block mb-4 text-[var(--primary)] hover:underline">
            ← Назад к выбору входа
          </Link>
          <h2 className="text-3xl font-bold text-white">Вход как Организатор</h2>
          <p className="mt-2 text-white">Введите данные для входа в аккаунт организатора</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Input formStates={form} type="email" name="email" placeholder="Email" className="w-full" />
          <PasswordInput formStates={form} name="password" placeholder="Пароль" />

          <button type="submit" disabled={loading} className="w-full bgButton p-3 font-semibold">
            {loading ? "Вход..." : "Войти как Организатор"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-white">
            Нет аккаунта организатора?{" "}
            <Link href="/register/organizer" className="text-[var(--primary)] hover:underline">
              Зарегистрироваться
            </Link>
          </p>
          <p className="text-sm text-white">
            Хотите войти как танцор?{" "}
            <Link href="/login/dancer" className="text-[var(--primary)] hover:underline">
              Вход для танцоров
            </Link>
          </p>
        </div>

        <button
          onClick={() => signIn("yandex-organizer", { callbackUrl: "/profile" })}
          className="w-full bgButton p-3 font-semibold gap-2"
        >
          <span>Войти через</span>
          <img src={"/images/yandex.svg"} alt="" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
