import Navbar from "@/components/layout/Navbar";
import SiteChrome from "@/components/layout/SiteChrome";
import AnimatedBackground from "@/components/effects/AnimatedBackground";

export default function PublicLayout({ children }) {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      {/* pb-16 (64px) = StatusBar (28px) + SocialFooter (36px) stacked below content */}
      <div className="pb-16">{children}</div>
      <SiteChrome />
    </>
  );
}
