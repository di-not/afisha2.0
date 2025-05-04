import { getUserSession } from "@/lib/getUserSession";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { createEvent } from "../actions";
export default async function ProfilePage() {
    const session = await getUserSession();
    if (!session) {
        return redirect("/non-auth");
    }
    const user = await prisma.user.findFirst({ where: { id: session?.id } });

    return (
        <div>
            <h1>Профиль</h1>
            <p>{user?.fullName}</p>
            
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
        </div>
    );
}
