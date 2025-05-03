import Image from "next/image";
import logo from '@/public/images/logo.svg'
const Logo: React.FC = () => {
    
    return (
        <div>
            <Image src={logo} alt="DanceAfisha"/>
        </div>
    );
};
export default Logo ;
