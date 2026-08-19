import AboutTerminal from "@/components/profile/AboutTerminal";
import SocialPosts from "@/components/profile/SocialPosts";

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-20 pt-4 sm:pb-24">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cd ~/about</p>
      <div className="max-w-3xl">
        <AboutTerminal />
      </div>
      <SocialPosts />
    </main>
  );
}
