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
import { Input } from "@/shared/components/ui/input";

const schema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  fullName: z.string().min(2, "Имя должно быть не менее 2 символов"),
  phone: z.string().optional(),
});

export default function UserRegistrationPage() {
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
      const res = await registerUser({ ...data, isOrganizer: false });
      
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        router.push("/login?message=registration_success");
      }
    } catch (error) {
      setError("Ошибка регистрации");
      console.error("Ошибка регистрации", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYandexLogin = async () => {
    await signIn("yandex", { 
      callbackUrl: "/profile",
      state: "dancer"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bgGradient py-12 px-4">
      <div className="w-full space-y-8 p-8 bg-white rounded-4xl shadow-lg bgPrimary max-w-[480px]">
        <div className="text-center">
          <h2 className="text-[28px] font-bold text-white text-left">Регистрация участника</h2>
          <p className="mt-2 text-white text-left">Создайте аккаунт для участия в мероприятиях</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Input name="fullName" formStates={form} placeholder="ФИО" className="w-full p-3" />
          <Input name="email" type="email" formStates={form} placeholder="Email" className="w-full p-3" />
          <PasswordInput formStates={form} name="password" placeholder="Пароль" />
          <Input name="phone" formStates={form} placeholder="Телефон (необязательно)" className="w-full p-3" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bgButton py-3 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="w-full my-4 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-white">или</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button
          onClick={() => signIn("yandex-dancer", { callbackUrl: "/profile" })}
          className="w-full bgButton p-3 font-semibold gap-2"
        >
          <span>Войти через</span>
          <img src={"/images/yandex.svg"} alt="" className="w-6 h-6" />
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-white">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-(--primary) hover:underline">
              Войти
            </Link>
          </p>
          <p className="text-sm text-white">
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