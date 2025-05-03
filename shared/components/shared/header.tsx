

import Logo from "../ui/logo";
import Link from "next/link";
import ProfileBlock from "./profileBlock";

interface headerProps {}
const Header: React.FC<headerProps> = (props) => {   
    return (
        <header
            className={`w-[calc(100%_-_160px)] h-[80px] flex justify-between rounded-full m-[0_80px] mt-1 fixed top-0 bgPrimary`}
        >

            <div className="container">
                <div className="flex justify-between w-full items-center h-full">
                    <Link href="/" className="m-[auto_0] pb-1">
                        <Logo />
                    </Link>
                    <ProfileBlock/>
                </div>
                
            </div>
        </header>
    );
};

export default Header;
