import TerminalWindow from "@/components/terminal/TerminalWindow";

export default function AdminSection({ title, children, className = "" }) {
  return (
    <TerminalWindow title={title} animate={false} className={className}>
      {children}
    </TerminalWindow>
  );
}
