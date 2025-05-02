"use client";
import { useSession, signIn } from "next-auth/react";

interface headerProps {}
const Header: React.FC<headerProps> = (props) => {
    const { data: session } = useSession();
    console.log(session);
    return (
        <div className="w-full h-[100px] bg-white">
            <button
            className='text-black'
                onClick={() =>
                    signIn('yandex', {
                        callbackUrl: "/",
                        redirect: true,
                    })
                }
            >
                Войти через яндекс
            </button>
        </div>
    );
};

export default Header;
