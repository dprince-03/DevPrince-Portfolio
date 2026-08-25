import ProfileCard from "@/components/profile/ProfileCard";
import AboutTerminal from "@/components/profile/AboutTerminal";
import SocialPosts from "@/components/profile/SocialPosts";

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-20 pt-4 sm:pb-24">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cd ~/about</p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <ProfileCard className="lg:w-[300px] lg:flex-shrink-0" />
        <AboutTerminal className="flex-1" />
      </div>
      <SocialPosts />
    </main>
  );
}
