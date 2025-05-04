"use client";
import { useSession } from "next-auth/react";
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
                <LogInBlock />
            )}
        </div>
    );
};
export default ProfileBlock;
