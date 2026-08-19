import ProfileCard from "@/components/profile/ProfileCard";
import SystemInfo from "@/components/profile/SystemInfo";

export default function ProfilePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col px-6 pb-20 pt-4 sm:pb-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
        <ProfileCard className="lg:w-[300px] lg:flex-shrink-0" />
        <SystemInfo className="flex-1" />
      </div>
    </main>
  );
}
