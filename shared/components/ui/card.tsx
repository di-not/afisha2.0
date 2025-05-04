import { EventType } from "@/shared/constants/types";
import Image from "next/image";
import Link from "next/link";

interface cardProps {
    element: EventType;
}
const Card: React.FC<cardProps> = ({ element }) => {
    return (
        <li
            
            className="group gap-5 p-3 transition delay-20 duration-300 ease-in-out 
            cursor-pointer rounded-3xl shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)] 
            hover:shadow-[0px_5px_3px_0.5px_rgba(0,0,0,0.2)]"
        >
            <Link href={`/event/${element.id}`}>
                <div className="overflow-hidden rounded-xl  max-h-[252px] max-w-[252px]">
                    <Image
                        alt={"изображение"}
                        src={element.imageUrl}
                        width={244}
                        height={244}
                        className="group-hover:scale-103
                        max-h-[244px] max-w-[244px] object-cover rounded-xl 
                        aspect-square transition delay-0 duration-300 w-full h-full"
                    />
                </div>
                <div className="p-0.5 pt-2">
                    <p className="text-sm font-medium truncate text-black/60 mb-1">
                        {element.place.name}
                    </p>
                    <p
                        className="group-hover:text-(--primary) text-black text-[18px] font-bold 
                    line-clamp-[2] transition delay-20 duration-300 ease-in-out"
                    >
                        {element.title}
                    </p>
                </div>
            </Link>
        </li>
    );
};
export default Card;
