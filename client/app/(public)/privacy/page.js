import TerminalWindow from "@/components/terminal/TerminalWindow";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-widest text-term-silver-dim">$ cat privacy.md</p>
      {/* Narrower than the page shell on purpose — prose reads badly at 1152px wide */}
      <div className="max-w-3xl">
        <TerminalWindow title="privacy.md" animate={false}>
          <div className="space-y-4 text-sm text-term-silver">
            <p>
              This site can log anonymous page visits — which pages get read, roughly where visitors are
              (country, from IP, never stored raw), and what referred them. It never touches ads, trackers
              sold to third parties, or anything that identifies you personally.
            </p>
            <p>
              An anonymous cookie (<code className="text-term-gold">visitor_id</code>) tells repeat visits
              apart from new ones. It carries no personal information and isn&apos;t linked to anything you
              enter elsewhere on the site (like the contact form).
            </p>
            <p>
              The contact form stores what you submit (name, email, message) so it can be read and replied
              to — nothing more.
            </p>
            <p>You can decline analytics entirely from the cookie banner; the rest of the site works the same either way.</p>
          </div>
        </TerminalWindow>
      </div>
    </main>
  );
}
