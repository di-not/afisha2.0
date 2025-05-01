
import { getAllEvents, getEventById } from "@/services/events";
import { Metadata } from "next";

type Props = {
    params: {
        id: string;
    };
};

export async function generateStaticParams() {
    const events: any[] = await getAllEvents();
    return events.map((event) => ({
        slug: event.id.toString(),
    }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const event = await getEventById(id);
    return {
        title: event?.title ?? "",
    };
}

export default async function Event({ params }: Props) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        return <h1>Event Not Found</h1>;
    }
    return (
        <div>
            <img src={event.imageUrl} alt="" />
            <h1>{event.title}</h1>
            <p>{event.description}</p>
        </div>
    );
}
