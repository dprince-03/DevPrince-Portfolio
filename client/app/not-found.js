import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-term-bg px-6 font-mono text-term-white">
      <div className="w-full max-w-2xl space-y-1 text-xs leading-relaxed sm:text-sm">
        <p className="text-term-red">
          [ &nbsp;&nbsp;0.000042] Kernel panic - not syncing: page not found
        </p>
        <p className="text-term-silver-dim">[ &nbsp;&nbsp;0.000048] CPU: 0 PID: 404 Comm: devprince-portfolio</p>
        <p className="text-term-silver-dim">[ &nbsp;&nbsp;0.000051] Call Trace:</p>
        <p className="pl-6 text-term-silver-dim"> route_resolve+0x2a/0x40</p>
        <p className="pl-6 text-term-silver-dim"> handle_request+0x1d/0x90</p>
        <p className="pl-6 text-term-silver-dim"> ? bash: page: command not found</p>
        <p className="pt-4 text-term-gold">
          $ the page you requested does not exist.
        </p>
        <p className="pt-6">
          <Link href="/" className="text-term-blue hover:underline">
            $ cd ~/ &amp;&amp; reboot
          </Link>
        </p>
      </div>
    </main>
  );
}
