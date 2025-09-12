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
    const errorParam = searchParams?.get("error");
    const yandexParam = searchParams?.get("yandex");

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

    // Автоматический вход через Яндекс если передан параметр
    if (yandexParam === "true") {
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
        redirect: true,
      });
    } catch (error) {
      setError("Ошибка входа через Яндекс");
      setYandexLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bgGradient py-12 px-4">
      <div className="w-full space-y-8 p-8 bg-white rounded-4xl shadow-lg bgPrimary max-w-[480px]">
        <div className="text-center">
          <Link href="/login" className="inline-block mb-4 text-[var(--primary)] hover:underline">
            ← Назад к выбору входа
          </Link>
          <h2 className="text-3xl font-bold text-white">Вход как Танцор</h2>
          <p className="mt-2 text-white">Введите данные для входа в аккаунт танцора</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Input formStates={form} type="email" name="email" placeholder="Email" className="w-full" />
          <PasswordInput formStates={form} name="password" placeholder="Пароль" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bgButton p-3 font-semibold"
          >
            {loading ? "Вход..." : "Войти как Танцор"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-white">
            Нет аккаунта танцора?{" "}
            <Link href="/register/dancer" className="text-[var(--primary)] hover:underline">
              Зарегистрироваться
            </Link>
          </p>
          <p className="text-sm text-white">
            Хотите войти как организатор?{" "}
            <Link href="/login/organizer" className="text-[var(--primary)] hover:underline">
              Вход для организаторов
            </Link>
          </p>
        </div>
        <button
          onClick={() => signIn("yandex-dancer", { callbackUrl: "/profile" })}
          className="w-full bgButton p-3 font-semibold gap-2"
        >
          <span>Войти через</span>
          <img src={"/images/yandex.svg"} alt="" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
