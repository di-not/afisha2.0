import UserEventsList from "@/widgets/user-events/ui/user-events-list";

export default function WillGoPage() {
  return <UserEventsList type="willgo" title="Я пойду" />;
}

export const metadata = {
  title: "Я пойду",
};
