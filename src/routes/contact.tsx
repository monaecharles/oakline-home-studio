import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Figure, PageIntro } from "@/components/site/Figure";
import { INQUIRY_PREFILL_KEY } from "@/lib/design-store";
import { download } from "@/lib/download";
import { INQUIRY_KEY, inquirySummary, minConsultDate, readSavedInquiry, type Inquiry } from "@/lib/inquiry";
import { pageHead } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead(
      "/contact",
      "Start Your Home | Oakline Custom Homes",
      "Save a project brief for a custom home, addition or renovation in Atlanta, Marietta, Roswell and nearby communities. Studio conversations by appointment.",
    ),
  component: Contact,
});

const PROJECT_TYPES = ["Custom home", "Major addition", "Comprehensive interior renovation", "Not sure yet"];
const PROPERTY = ["I own the lot or house", "Under contract", "Still looking for property"];
const TIMEFRAMES = ["Within 6 months", "6–12 months", "12–24 months", "More than 2 years"];
const INVESTMENT = ["Under $500,000", "$500,000–$1 million", "$1–2 million", "Over $2 million", "Prefer to discuss"];

type Stage = "form" | "review" | "saved";

function Contact() {
  const [stage, setStage] = useState<Stage>("form");
  const [storageOk, setStorageOk] = useState(true);
  const [saved, setSaved] = useState<Inquiry | null>(null);
  const [copied, setCopied] = useState("");
  const form = useForm<Inquiry>({
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "", area: "", projectType: "", propertyStatus: "", timeframe: "", investment: "", priorities: "", message: "", consultDate: "", consultWindow: "", consent: false },
  });
  const { register, handleSubmit, formState: { errors }, reset, getValues, setValue, setFocus } = form;

  useEffect(() => {
    const r = readSavedInquiry();
    setStorageOk(r.ok);
    if (r.data) {
      setSaved(r.data);
      reset(r.data);
      setStage("saved");
    }
    let prefill: string | null = null;
    try {
      prefill = sessionStorage.getItem(INQUIRY_PREFILL_KEY);
      sessionStorage.removeItem(INQUIRY_PREFILL_KEY);
    } catch {
      prefill = (window as unknown as { __oaklinePrefill?: string }).__oaklinePrefill ?? null;
    }
    if (prefill) {
      const cur = getValues("priorities");
      setValue("priorities", cur ? `${cur}\n\n${prefill}` : prefill);
      setStage("form");
    }
  }, [reset, getValues, setValue]);

  const onReview = () => setStage("review");
  const onInvalid = (e: typeof errors) => {
    const first = Object.keys(e)[0] as keyof Inquiry | undefined;
    if (first) setFocus(first);
  };

  const save = () => {
    const data = getValues();
    if (!data.consent) return;
    try {
      localStorage.setItem(INQUIRY_KEY, JSON.stringify(data));
      setStorageOk(true);
    } catch {
      setStorageOk(false);
    }
    setSaved(data);
    setStage("saved");
  };
  const del = () => {
    if (!window.confirm("Delete the project brief saved on this device?")) return;
    try {
      localStorage.removeItem(INQUIRY_KEY);
    } catch {
      /* ignore */
    }
    setSaved(null);
    reset();
    setStage("form");
  };

  const err = (k: keyof Inquiry) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1 text-[14px] text-destructive">{String(errors[k]?.message)}</p>
    ) : null;
  const aria = (k: keyof Inquiry) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });
  const L = ({ f, children }: { f: string; children: React.ReactNode }) => <label htmlFor={f} className="mb-1 block text-[15px] font-semibold">{children}</label>;
  const sel = (k: keyof Inquiry, opts: string[], label: string) => (
    <div>
      <L f={k}>{label}</L>
      <select id={k} className="field" {...register(k, { required: `Choose a ${label.toLowerCase()}.` })} {...aria(k)}>
        <option value="">Choose one</option>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
      {err(k)}
    </div>
  );

  return (
    <>
      <PageIntro eyebrow="Start your home" title="Tell us about your project">
        Fill in what you know now. Your brief is saved in this browser so you can bring it to a first conversation; nothing is sent from this page.
      </PageIntro>
      <section className="wrap section">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="border border-primary bg-card p-4 md:p-6">
            {!storageOk && (
              <p role="status" className="mb-4 border border-border bg-secondary p-3 text-[15px]">
                This browser is blocking storage. Your brief will stay on this page only and disappear when you close it.
              </p>
            )}
            {stage === "form" && (
              <form noValidate onSubmit={handleSubmit(onReview, onInvalid)} className="grid gap-4 md:grid-cols-2" aria-label="Project brief">
                <div>
                  <L f="name">Name</L>
                  <input id="name" className="field" autoComplete="name" {...register("name", { required: "Enter your name." })} {...aria("name")} />
                  {err("name")}
                </div>
                <div>
                  <L f="email">Email</L>
                  <input id="email" type="email" className="field" autoComplete="email" {...register("email", { required: "Enter your email.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter an email like name@domain.com." } })} {...aria("email")} />
                  {err("email")}
                </div>
                <div>
                  <L f="phone">Phone (optional)</L>
                  <input id="phone" type="tel" className="field" autoComplete="tel" {...register("phone", { pattern: { value: /^[0-9()+.\-\s]{7,20}$/, message: "Use digits, spaces or dashes." } })} {...aria("phone")} />
                  {err("phone")}
                </div>
                <div>
                  <L f="area">City or neighborhood</L>
                  <input id="area" className="field" placeholder="For instance, East Cobb" {...register("area", { required: "Enter a city or neighborhood." })} {...aria("area")} />
                  <p className="mt-1 text-[13px] text-muted-foreground">No street address needed.</p>
                  {err("area")}
                </div>
                {sel("projectType", PROJECT_TYPES, "Project type")}
                {sel("propertyStatus", PROPERTY, "Property status")}
                {sel("timeframe", TIMEFRAMES, "Preferred timeframe")}
                {sel("investment", INVESTMENT, "Investment range")}
                <div>
                  <L f="consultDate">Preferred consultation date (optional)</L>
                  <input id="consultDate" type="date" min={minConsultDate()} className="field" {...register("consultDate", { validate: (v) => !v || v >= minConsultDate() || "Choose a future date." })} {...aria("consultDate")} />
                  {err("consultDate")}
                </div>
                <div>
                  <L f="consultWindow">Time window, Eastern Time</L>
                  <select id="consultWindow" className="field" {...register("consultWindow")}>
                    <option value="">Any time</option>
                    <option>Morning, 9 a.m.–12 p.m. ET</option>
                    <option>Afternoon, 1–5 p.m. ET</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <L f="priorities">Priorities</L>
                  <textarea id="priorities" rows={5} className="field" placeholder="Rooms, materials or ways of living that matter most" {...register("priorities", { required: "Tell us at least one priority." })} {...aria("priorities")} />
                  {err("priorities")}
                </div>
                <div className="md:col-span-2">
                  <L f="message">Message</L>
                  <textarea id="message" rows={4} className="field" {...register("message", { required: "Add a short message." })} {...aria("message")} />
                  {err("message")}
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-start gap-3 text-[15px]">
                    <input type="checkbox" className="mt-1 h-5 w-5" {...register("consent", { required: "Check this box to save the brief on this device." })} {...aria("consent")} />
                    Save this brief in this browser on this device. It is not sent to Oakline or anyone else, and you can delete it at any time.
                  </label>
                  {err("consent")}
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="btn btn-solid">Review project brief</button>
                </div>
              </form>
            )}
            {stage === "review" && (
              <div>
                <h2 className="text-[26px]">Review your brief</h2>
                <pre className="mt-3 whitespace-pre-wrap border border-border bg-background p-4 font-sans text-[15px]">{inquirySummary(getValues())}</pre>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="btn btn-solid" onClick={save}>Save project brief</button>
                  <button className="btn btn-line" onClick={() => setStage("form")}>Edit</button>
                </div>
              </div>
            )}
            {stage === "saved" && saved && (
              <div>
                <h2 className="text-[26px]">Brief saved</h2>
                <p role="status" className="mt-2 border border-primary bg-secondary p-3 font-semibold">
                  {storageOk ? "Saved on this device. Nothing has been sent." : "Kept on this page only. Nothing has been sent. It will disappear when you close the page."}
                </p>
                <pre className="mt-3 whitespace-pre-wrap border border-border bg-background p-4 font-sans text-[15px]">{inquirySummary(saved)}</pre>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="btn btn-line" onClick={() => setStage("form")}>Edit</button>
                  <button
                    className="btn btn-line"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(inquirySummary(saved));
                        setCopied("Summary copied.");
                      } catch {
                        setCopied("Copy is not available in this browser. Use Download instead.");
                      }
                    }}
                  >
                    Copy summary
                  </button>
                  <button className="btn btn-line" onClick={() => download("oakline-project-brief.txt", inquirySummary(saved))}>Download .txt</button>
                  <button className="btn btn-line" onClick={del}>Clear saved information</button>
                </div>
                <p className="mt-2 text-[14px]" role="status">{copied}</p>
              </div>
            )}
          </div>
          <aside className="space-y-4">
            <div className="panel">
              <h2 className="text-[24px]">Studio</h2>
              <dl className="mt-3 space-y-2 text-[15px]">
                <div><dt className="font-semibold">Email</dt><dd>studio@oaklinecustomhomes.com</dd></div>
                <div><dt className="font-semibold">Phone</dt><dd>(678) 555-0148</dd></div>
                <div><dt className="font-semibold">Service area</dt><dd>Atlanta, Marietta, Roswell and nearby communities</dd></div>
                <div><dt className="font-semibold">Hours</dt><dd>Monday–Friday, 9 a.m.–5 p.m. Eastern. Studio conversations by appointment.</dd></div>
              </dl>
            </div>
            <Figure k="oakline-08" caption="Samples and objects on the studio console." ratio="4/3" />
          </aside>
        </div>
      </section>
    </>
  );
}
