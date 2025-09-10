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
        <Link className="bgButton h-[50px] w-[50px] flex items-center justify-center rounded-full" href={"/profile"}>
          <ProfileLink width={24} height={24} viewBox="0 0 24 24" />
        </Link>
      ) : (
        <>
          <Link
            href="/register/user"
            className="bgButtonSecondary p-2.5 px-4"
          >
            Регистрация
          </Link>
          <Link href="/login" className="bgButton p-2.5 px-6">Войти</Link>
        </>
      )}
    </div>
  );
};
export default ProfileBlock;
