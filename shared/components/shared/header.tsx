import Logo from "../ui/logo";
import Link from "next/link";
import ProfileBlock from "./profileBlock";

const Header: React.FC = () => {
    return (
        <header className={`w-full z-10 h-[70px] m-[0_auto] sticky top-[12px]`}>
            <div className="container max-w-[1340px]!">
                <div className=" bgPrimary  rounded-full max-w-[1340px] flex justify-between h-[70px] w-full ">
                    <div className="flex justify-between w-full items-center h-full px-[50px]">
                        <Link href="/" className="m-[auto_0] pb-1 ">
                            <Logo />
                        </Link>
                        <ProfileBlock />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
