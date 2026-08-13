import ProfileCard from "@/components/profile/ProfileCard";
import NowBadge from "@/components/profile/NowBadge";
import GithubStats from "@/components/profile/GithubStats";

export default function ProfilePage() {
  // Card's top position is untouched (still right after the $ whoami line,
  // same as before) — only its bottom edge extends, via flex-1, to fill the
  // rest of the space down to the footer stack. Symmetric py-16/py-20 on
  // this container is what keeps the top and bottom gaps matching.
  return (
    <main className="mx-auto flex min-h-[calc(100vh-53px-64px)] max-w-6xl flex-col px-6 py-16 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-term-silver-dim">
          $ whoami
        </p>
        <NowBadge />
      </div>
      <div className="mt-6 flex flex-1 flex-col">
        <ProfileCard className="flex-1" />
      </div>
      <GithubStats />
    </main>
  );
}
