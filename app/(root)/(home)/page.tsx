"use server";
import { getAllEvents } from "@/services/events";
import { createEvent } from "../actions";

export default async function Root() {
    const events = await getAllEvents();

    return (
        <div className="container">
            <form action={createEvent} className="flex flex-col bg-0 border-2">
                <input type="text" placeholder="title" required name="title" />
                <textarea
                    placeholder="descripion"
                    required
                    name="description"
                />
                <input type="hidden" name="id" />
                <input type="file" name="image" />
                <input type="hidden" name="createAt" />
                <input type="hidden" name="updateAt" />
                <button type="submit">Добавить эвент</button>
            </form>
            <ul>
                {events.map((element: any, index: number) => (
                    <li key={index}>
                        <p> {element.title}</p>
                        <b>{element.description}</b>
                    </li>
                ))}
            </ul>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    );
}
