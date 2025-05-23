import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";

import Yandex from "@/public/images/yandex.svg";

const LogInBlock: React.FC = () => {
    const form = useForm<{ email: string; password: string }>({
        defaultValues: {
            email: "",
            password: "",
        },
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
        } catch (error) {
            console.error("не удалось войти");
        }
    };
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        onClick={() => {}}
                        className="bgButton p-[8px_16px] text-lg font-medium"
                    >
                        Войти
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[360px] h-fit bgPrimary rounded-4xl">
                    <div className="flex flex-col pb-2 items-center">
                        <div className="flex flex-col p-4 items-center w-full">
                            <p className="text-4xl font-bold text-(--text-color) text-center mb-8">
                                Войти
                            </p>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-4 items-center w-full"
                            >
                                <input
                                    {...form.register("email")}
                                    className="bgInput p-2.5 pl-5 pr-14 w-full"
                                    placeholder="Почта"
                                />
                                <input
                                    {...form.register("password")}
                                    className="bgInput p-2.5 pl-5 pr-14 w-full"
                                    placeholder="Пароль"
                                />
                                <button
                                    type="submit"
                                    className="bgButton text-xl p-[8px_16px]  font-semibold  w-full mt-1"
                                >
                                    {form.formState.isSubmitting
                                        ? "Вход..."
                                        : "Войти"}
                                </button>
                            </form>
                            <p className="text-lg font-medium text-(--text-color) text-center mb-2 mt-4">
                                Войти с помощью
                            </p>
                            <ul className="flex w-fit m-[0_auto] mb-3">
                                <li>
                                    <button
                                        onClick={() =>
                                            signIn("yandex", {
                                                callbackUrl: "/",
                                                redirect: true,
                                            })
                                        }
                                    >
                                        <Yandex />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div
                            className="flex gap-4 bg-white/30 rounded-full shadow-[0px_3px_8px_0px_rgba(0,0,0,0.20)] 
            inset-shadow-[0px_0px_10px_7px_rgba(255,255,255,0.25)] w-full items-center px-4 py-4 justify-center"
                        >
                            <p className="text-[17px] font-medium text-(--text-color) text-center">
                                Нет аккаунта?
                            </p>{" "}
                            <button className="text-[17px] font-normal text-(--primary) text-center ">
                                Зарегистрироваться
                            </button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};
export default LogInBlock;
