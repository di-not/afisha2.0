"use client";
import { useSession} from "next-auth/react";
import Link from "next/link";
import ProfileLink from "@/public/images/profile_icon.svg";
import LogInBlock from "./logInBlock";



interface ProfileBlockProps {}
const ProfileBlock: React.FC<ProfileBlockProps> = () => {
    const { data: session } = useSession();

    

    return (
        <div>
            {session ? (
                <Link className="bgButton h-[50px] w-[50px]" href={"/profile"}>
                    <ProfileLink width={30} height={30} viewBox="0 0 24 24" />
                </Link>
            ) : (
                <LogInBlock/>
            )}
            {/* {!session ? (
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
                                {...form.register("email")}
                                className="bg-black  w-[60%] text-white"
                                placeholder="email"
                            />
                            <input
                                {...form.register("password")}
                                className="bg-black w-[60%]  text-white"
                                placeholder="password"
                            />
                            <button
                                type="submit"
                                className="bg-red-500 text-white"
                            >
                                {form.formState.isSubmitting
                                    ? "Вход..."
                                    : "Войти"}
                            </button>
                        </form>
                    </>
                ) : (
                    <Link className="text-black" href={"/profile"}>
                        Профиль
                    </Link>
                )} */}
        </div>
    );
};
export default ProfileBlock;
