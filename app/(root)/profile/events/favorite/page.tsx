import UserEventsList from "@/widgets/user-events/ui/user-events-list";

export default function FavoriteEventsPage() {
  return <UserEventsList type="favorite" title="Понравившиеся мероприятия" />;
}

export const metadata = {
  title: "Понравившиеся мероприятия",
};
