import TerminalWindow from "@/components/terminal/TerminalWindow";

// Placeholder — swap for your real name/title/email/link (later: editable
// from the admin dashboard).
const key = (text) => <span className="text-term-gold">&quot;{text}&quot;</span>;
const punct = (text) => <span className="text-term-silver">{text}</span>;
const str = (text) => <span className="text-term-green">&quot;{text}&quot;</span>;
const link = (href, label) => (
  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-term-blue hover:underline">
    {label}
  </a>
);

const LINES = [
  <span key="filename" className="text-term-white">
    business-card.json
  </span>,
  <span key="open">{punct("{")}</span>,
  <span key="name">
    &nbsp;&nbsp;{key("name")}
    {punct(": ")}
    {str("Your Name")}
    {punct(",")}
  </span>,
  <span key="title">
    &nbsp;&nbsp;{key("title")}
    {punct(": ")}
    {str("Backend & Full-Stack Developer")}
    {punct(",")}
  </span>,
  <span key="email">
    &nbsp;&nbsp;{key("email")}
    {punct(": ")}
    {link("mailto:you@example.com", "you@example.com")}
    {punct(",")}
  </span>,
  <span key="link">
    &nbsp;&nbsp;{key("link")}
    {punct(": ")}
    {link("https://yourdomain.dev", "yourdomain.dev")}
  </span>,
  <span key="close">{punct("}")}</span>,
];

export default function ProfileCard({ className = "" }) {
  // Full width of the page shell — right edge lines up with "contact" in
  // the navbar, since both use the same max-w-6xl container.
  return <TerminalWindow title="business-card.json" lines={LINES} className={className} />;
}
