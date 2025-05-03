"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface headerProps {}
const Header: React.FC<headerProps> = (props) => {
    const { data: session } = useSession();
    console.log(session);

    const form = useForm<{email:string,password:string}>({
        defaultValues: {
            email: "toni.kuvshinov.05@mail.ru",
            password: "12345",
        },
    });

    const onSubmit = async (data: {email:string,password:string}) => {
                
        try {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            });
            
            console.log(res)
            if (!res?.ok) {
                return console.error("не удалось войти");
            }
        } catch (error) {
            console.error("не удалось войти");
        }
    };
    return (
        <div className="w-full h-[200px] bg-white">
            {!session ? (
                <>
                    <button
                        className="text-black"
                        onClick={() =>
                            signIn("yandex", {
                                callbackUrl: "/",
                                redirect: true,
                            })
                        }
                    >
                        Войти через яндекс
                    </button>
                    <p>Войти норм</p>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2"
                    >
                        <input
                            {...form.register('email')}
                            className="bg-black  w-[60%] text-white"
                            placeholder="email"
                        />
                        <input
                            {...form.register('password')}
                            className="bg-black w-[60%]  text-white"
                            placeholder="password"
                        />
                        <button type="submit" className="bg-red-500 text-white">
                            {form.formState.isSubmitting ? "Вход..." : "Войти"}
                        </button>
                    </form>
                </>
            ) : (
                <Link className="text-black" href={'/profile'}>
                   Профиль
                </Link>
            )}
        </div>
    );
};

export default Header;
