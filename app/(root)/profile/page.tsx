import { getUserSession } from "@/lib/getUserSession";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
        </div>
    );
}
