import UserEventsList from "@/widgets/user-events/ui/user-events-list";

export default function BookmarksPage() {
  return <UserEventsList type="bookmarks" title="Закладки" />;
}

export const metadata = {
  title: "Закладки",
};