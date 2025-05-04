"use server";
import Card from "@/shared/components/ui/card";
import { EventType } from "@/shared/constants/types";
import { getAllEvents } from "@/services/events";

interface eventPaginateListProps {}

const EventPaginateList: React.FC<eventPaginateListProps> = async () => {
    const events = await getAllEvents();
    return (
        <ul className="grid grid-cols-[repeat(4_,260px)] gap-[30px_20px] justify-between ">
            {events.map((element: EventType, _) => (
                <Card element={element} key={element.id} />
            ))}
        </ul>
    );
};
export default EventPaginateList;
