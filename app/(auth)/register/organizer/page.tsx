"use client";
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
import { Input } from "@/shared/components/ui/input";

const schema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  fullName: z.string().min(2, "Имя должно быть не менее 2 символов"),
  phone: z.string().optional(),
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
    <div className="min-h-screen flex items-center justify-center bgGradient py-12 px-4">
      <div className="w-full space-y-8 p-8 bg-white rounded-4xl shadow-lg bgPrimary max-w-[480px]">
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-white text-left">Регистрация организатора</h2>
          <p className="mt-2 text-white text-left">Создайте аккаунт для организации мероприятий</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Input name="fullName" formStates={form} placeholder="ФИО" className="w-full p-3 " />

          <Input formStates={form} name="phone" placeholder="Телефон" className=" w-full p-3 " />
          <Input formStates={form} name="organizationCity" placeholder="Город организации" className=" w-full p-3 " />
          <Input name="email" type="email" placeholder="Email" className=" w-full p-3" formStates={form} />
          <PasswordInput formStates={form} name="password" placeholder="Пароль" />
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
          <span className="px-3 text-sm text-white">или</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={() => signIn("yandex-organizer", { callbackUrl: "/profile" })}
          className="w-full bgButton p-3 font-semibold gap-2"
        >
          <span>Войти через</span>
          <img src={"/images/yandex.svg"} alt="" className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-sm text-white">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-(--primary) hover:underline">
              Войти
            </Link>
          </p>
          <p className="mt-2 text-sm text-white">
            Обычный пользователь?{" "}
            <Link href="/register/dancer" className="text-(--primary) hover:underline">
              Регистрация танцора
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
