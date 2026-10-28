import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Wordmark } from "./Logo";
import { PHOTOS } from "@/lib/photos";
import { SITE_CONFIG } from "@/lib/site-config";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/residences", label: "Residences" },
  { to: "/explore-home", label: "Home Walkthrough" },
  { to: "/materials", label: "Materials & Finishes" },
  { to: "/design-build", label: "Design & Build" },
  { to: "/studio", label: "Our Studio" },
  { to: "/homeowner-guide", label: "Homeowner Guide" },
  { to: "/contact", label: "Start Your Home" },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col">
      {NAV.map((n) => (
        <li key={n.to}>
          <Link
            to={n.to}
            onClick={onNavigate}
            activeOptions={{ exact: true }}
            className="block py-2.5 text-[15px] text-foreground hover:text-primary data-[status=active]:font-semibold data-[status=active]:text-primary"
            activeProps={{ "aria-current": "page" }}
          >
            {n.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-card focus:p-2">
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[210px] flex-col bg-background px-5 py-6 lg:flex">
        <Link to="/" aria-label="Oakline Custom Homes, home">
          <Wordmark />
        </Link>
        <p className="mt-4 pt-3 font-display text-[15px] italic leading-snug text-walnut">
          Built around the way you live.
        </p>
        <nav aria-label="Primary" className="mt-6">
          <NavList />
        </nav>
        <div className="mt-auto pt-3 text-[13px] leading-relaxed text-muted-foreground">
          Atlanta, Marietta, Roswell
          <br />
          Visits by appointment
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary bg-background px-4 lg:hidden">
        <Link to="/" aria-label="Oakline Custom Homes, home">
          <Wordmark />
        </Link>
        <button
          ref={btnRef}
          className="btn btn-line"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>
      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="fixed inset-x-0 top-16 z-30 border-b border-primary bg-background px-4 pb-4 lg:hidden">
          <NavList onNavigate={() => setOpen(false)} />
        </nav>
      )}

      <div className="lg:ml-[210px]">
        <main id="main">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function Footer() {
  const [dlg, setDlg] = useState<null | "privacy" | "photos">(null);
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (dlg && !d.open) d.showModal();
    if (!dlg && d.open) d.close();
  }, [dlg]);
  const open = (k: "privacy" | "photos") => (e: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget;
    setDlg(k);
  };
  const socials = Object.entries(SITE_CONFIG.social).filter(([, v]) => !!v);
  return (
    <footer className="border-t border-primary">
      <div className="wrap grid gap-6 py-8 md:grid-cols-3">
        <div>
          <Wordmark />
          <p className="mt-3 text-[15px] text-muted-foreground">Custom homes, major additions and whole-home renovations across metro Atlanta.</p>
        </div>
        <div className="text-[15px]">
          <p>studio@oaklinecustomhomes.com</p>
          <p>(678) 555-0148</p>
          <p className="text-muted-foreground">Monday–Friday, 9 a.m.–5 p.m. Eastern</p>
        </div>
        <div className="flex flex-wrap items-start gap-3 md:justify-end">
          {socials.map(([k, v]) => (
            <a key={k} href={v} className="btn btn-line capitalize" rel="noopener">{k}</a>
          ))}
          <button className="min-h-11 text-[14px] underline underline-offset-4" onClick={open("privacy")}>Privacy</button>
          <button className="min-h-11 text-[14px] underline underline-offset-4" onClick={open("photos")}>Photography</button>
        </div>
      </div>
      <p className="wrap pb-6 text-[13px] text-muted-foreground">© {new Date().getFullYear()} Oakline Custom Homes</p>
      <dialog
        ref={ref}
        onClose={() => {
          setDlg(null);
          opener.current?.focus();
        }}
        className="m-auto max-w-lg border border-primary bg-card p-6 text-foreground backdrop:bg-ink/50"
      >
        {dlg === "privacy" && (
          <>
            <h2 className="text-2xl">Privacy</h2>
            <p className="mt-3">
              This site does not send your information anywhere. When you save a project brief or a finish selection, it is stored only in
              this browser on this device. You can delete it from the Start Your Home page or the Materials & Finishes page at any time.
            </p>
          </>
        )}
        {dlg === "photos" && (
          <>
            <h2 className="text-2xl">Photography</h2>
            <p className="mt-3">
              Interior and exterior photographs are from Unsplash and used under the{" "}
              <a className="underline" href="https://unsplash.com/license" rel="noopener">Unsplash License</a>. They show general architectural
              inspiration, not Oakline projects. The walkthrough is the official Architectural Digest video of Alessandra Ambrosio’s home, embedded from YouTube. Material photographs are representative samples, not product specifications.
            </p>
            <ul className="mt-3 max-h-48 overflow-auto text-[14px]">
              {Object.values(PHOTOS).map((p) => (
                <li key={p.key}>
                  <a className="underline" href={`https://unsplash.com/photos/${p.id.replace("photo-", "")}`} rel="noopener">{p.alt}</a>
                </li>
              ))}
            </ul>
          </>
        )}
        <form method="dialog" className="mt-5">
          <button className="btn btn-solid">Close</button>
        </form>
      </dialog>
    </footer>
  );
}
