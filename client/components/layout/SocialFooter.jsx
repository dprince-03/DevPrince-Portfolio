import { WhatsappIcon, XIcon, LinkedinIcon, GithubIcon, InstagramIcon } from "@/components/icons/SocialIcons";

// Placeholder — swap for your real profile URLs.
const SOCIALS = [
  { label: "WhatsApp", href: "https://wa.me/10000000000", Icon: WhatsappIcon },
  { label: "X", href: "https://x.com/", Icon: XIcon },
  { label: "LinkedIn", href: "https://linkedin.com/in/", Icon: LinkedinIcon },
  { label: "GitHub", href: "https://github.com/", Icon: GithubIcon },
  { label: "Instagram", href: "https://instagram.com/", Icon: InstagramIcon },
];

// Sits directly above the fixed StatusBar (bottom-7 = StatusBar's own height).
export default function SocialFooter() {
  return (
    <div className="fixed inset-x-0 bottom-7 z-20 flex h-9 items-center justify-center gap-5 border-t border-term-border bg-term-panel px-4">
      {SOCIALS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="text-term-silver-dim transition-colors hover:text-term-gold"
        >
          <Icon width={16} height={16} />
        </a>
      ))}
    </div>
  );
}
