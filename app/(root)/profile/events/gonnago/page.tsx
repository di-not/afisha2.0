import UserEventsList from "@/widgets/user-events/ui/user-events-list";

export default function GonnaGoPage() {
  return <UserEventsList type="gonnago" title="Я собираюсь" />;
}

export const metadata = {
  title: "Я собираюсь",
};