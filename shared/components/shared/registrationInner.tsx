import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import Yandex from "@/public/images/yandex.svg";
import { registerUser } from "@/app/(root)/actions";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PasswordInput } from "../ui/passwordInput";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string(),
});

type FormData = z.infer<typeof schema>;

const RegistrationInner: React.FC<{
    setOpenRegistraion: (open: boolean) => void;
}> = ({ setOpenRegistraion }) => {
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: {
        email: string;
        password: string;
        fullName: string;
    }) => {
        try {
            const res = await registerUser(data);

            if (res.error) {
                console.error(res.error);
                return console.error("не удалось зарегистрироваться");
            }
            if (res.success) {
                const signInResult = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInResult?.error) {
                    console.error("Ошибка авторизации:", signInResult.error);
                    return;
                }

                router.push("/profile");
            }
        } catch (error) {
            console.error("не удалось зарегистрироваться", error);
        }
    };

    return (
        <div className="flex flex-col pb-2 items-center">
            <div className="flex flex-col p-4 items-center w-full">
                <p className="text-4xl font-bold text-(--text-color) text-center mb-8">
                    Регистрация
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
                    <PasswordInput
                        formStates={form}
                        name={"password"}
                        placeholder={"Пароль"}
                    />
                    <input
                        {...form.register("fullName")}
                        className="bgInput p-2.5 pl-5 pr-14 w-full"
                        placeholder="Имя"
                    />
                    <button
                        type="submit"
                        className="bgButton text-xl p-[8px_16px]  font-semibold  w-full mt-1"
                    >
                        {form.formState.isSubmitting
                            ? "Регистрация..."
                            : "Зарегистрироваться"}
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
                    Есть аккаунт?
                </p>
                <button
                    className="text-[17px] font-normal text-(--primary) text-center"
                    onClick={() => setOpenRegistraion(false)}
                >
                    Войти
                </button>
            </div>
        </div>
    );
};
export { RegistrationInner };
