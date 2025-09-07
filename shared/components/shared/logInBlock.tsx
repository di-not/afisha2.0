// shared/components/shared/logInBlock.tsx
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import Yandex from "@/public/images/yandex.svg";
import { useState } from "react";
import { PasswordInput } from "../ui/passwordInput";
import Link from "next/link";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

const LogInBlock: React.FC = () => {
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            });

            if (!res?.ok) {
                return console.error("не удалось войти");
            }
            window.location.href = "/profile";
        } catch (error) {
            console.error("не удалось войти");
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="bgButton px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
                    Войти
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[360px] h-fit bgPrimary rounded-4xl p-0 overflow-hidden">
                <div className="flex flex-col pb-2 items-center">
                    <div className="flex flex-col p-6 items-center w-full">
                        <p className="text-2xl font-bold text-(--text-color) text-center mb-6">
                            Вход в аккаунт
                        </p>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 items-center w-full"
                        >
                            <input
                                {...form.register("email")}
                                className="bgInput p-3 rounded-lg w-full border border-gray-200"
                                placeholder="Почта"
                            />
                            <PasswordInput
                                formStates={form}
                                name={"password"}
                                placeholder={"Пароль"}
                            />
                            <button
                                type="submit"
                                className="bgButton text-lg p-3 font-semibold w-full mt-2 rounded-lg"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Вход..."
                                    : "Войти"}
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

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                Нет аккаунта?
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Link 
                                    href="/register/user"
                                    className="text-sm text-(--primary) hover:underline"
                                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
                                >
                                    Как участник
                                </Link>
                                <span className="text-gray-400">|</span>
                                <Link 
                                    href="/register/organizer"
                                    className="text-sm text-(--primary) hover:underline"
                                    onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))}
                                >
                                    Как организатор
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
export default LogInBlock;