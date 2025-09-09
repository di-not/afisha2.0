import { fetchSingleEvent } from "@/entities/event/lib/api";
import EventPage from "@/pages/event-page";
import Header from "@/shared/components/shared/header";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchSingleEvent(id);

  return {
    title: event.title,
    description: event.description,
    // openGraph: {
    //   title: quiz.name,
    //   description: quiz.description || "",
    //   images: [quiz.image],
    // },
  };
}

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await fetchSingleEvent(id);

  return (
    <>
      <Header />
      <main className="font-[family-name:var(--font-base)]">
        <EventPage event={event} />
      </main>
    </>
  );
}
