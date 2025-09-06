import { getUserSession } from "@/lib/getUserSession";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
        const session = await getUserSession();
        console.log(session);

        if (!session) {
                return redirect("/non-auth");
        }
        const user = await prisma.user.findFirst({ where: { id: session?.id } });
        if (!user) {
                return redirect("/non-auth");
        }
        return (
                <div>
                        <div className="relative  ">
                                <h1 className="font-medium text-2xl">Профиль</h1>
                                <div className="">
                                        <div className="flex mt-4">
                                                <button
                                                        type="button"
                                                        className="left-[10px] top-[-45px] w-[120px] h-[120px] rounded-full cursor-pointer group"
                                                >
                                                        <img
                                                                src="https://i.pinimg.com/736x/82/40/7e/82407e8e0aaa33e0c7ec1c450c0d28a1.jpg"
                                                                alt=""
                                                                className="w-full h-full object-cover rounded-full transition-filter duration-200 ease-in-out group-hover:brightness-60 group-active:brightness-60"
                                                        />
                                                </button>
                                                <p className="text-lg ml-6">
                                                    Имя
                                                    {/* {user?.fullName} */}
                                                    </p>
                                        </div>
                                        <div className="mt-4 flex flex-col gap-2 w-full">
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Телефон" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="ФИО" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Почта" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Город" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Стиль основной" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Остальные стили" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="О себе" />
                                                <p className="text-2xl font-medium">Соц. сети</p>
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Соц сеть1" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Соц сеть2" />
                                                <input className={'border-1 rounded-2xl p-2'} placeholder="Соц сеть3" />
                                        </div>
                                </div>
                                {/* <form action={createEvent} className="flex flex-col bg-0 border-2">
                                        <input type="text" placeholder="title" required name="title" />
                                        <textarea placeholder="descripion" required name="description" />
                                        <input type="hidden" name="id" />
                                        <input type="file" name="image" />
                                        <input type="hidden" name="createAt" />
                                        <input type="hidden" name="updateAt" />
                                        <button type="submit">Добавить эвент</button>
                                </form> */}
                        </div>
                </div>
        );
}
