
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProfileLink from "@/public/images/profile_icon.svg";
import LogInBlock from "./logInBlock";

interface ProfileBlockProps {}
const ProfileBlock: React.FC<ProfileBlockProps> = () => {
    const { data: session } = useSession();
    
    return (
        <div className="flex items-center gap-3">
            {session && session?.user ? (
                <Link 
                    className="bgButton h-[50px] w-[50px] flex items-center justify-center rounded-full"
                    href={"/profile"}
                >
                    <ProfileLink width={24} height={24} viewBox="0 0 24 24" />
                </Link>
            ) : (
                <>
                    <Link 
                        href="/register/user" 
                        className="bg-transparent border-2 border-(--primary) text-(--primary) px-4 py-2 rounded-full font-medium hover:bg-(--primary) hover:text-white transition-colors"
                    >
                        Регистрация
                    </Link>
                    <LogInBlock />
                </>
            )}
        </div>
    );
};
export default ProfileBlock;