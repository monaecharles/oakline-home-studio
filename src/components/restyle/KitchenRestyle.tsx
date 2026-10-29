import { useState } from "react";
import { Check } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Button } from "@/components/ui/button";
import { designStore } from "@/lib/design-store";
import { KITCHEN_CABINETS, KITCHEN_COUNTERS, KITCHEN_CREDIT, KITCHEN_ORIGINAL, kitchenImage, type CabinetId, type CounterId } from "./restyle-data";

function Choice({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={`flex min-h-11 items-center justify-between gap-2 border px-3 text-left text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "border-primary bg-secondary font-semibold" : "border-border hover:bg-secondary/60"}`}>
      {label}{active && <Check className="size-4 text-primary" aria-hidden />}
    </button>
  );
}

export function KitchenRestyle() {
  const [cab, setCab] = useState<CabinetId>("green");
  const [ctr, setCtr] = useState<CounterId>("dark");
  const [msg, setMsg] = useState("");
  const after = kitchenImage(cab, ctr);
  const cabName = KITCHEN_CABINETS.find((c) => c.id === cab)!.name;
  const ctrName = KITCHEN_COUNTERS.find((c) => c.id === ctr)!.name;

  const save = () => {
    designStore.hydrate();
    const c = KITCHEN_CABINETS.find((o) => o.id === cab)?.designId;
    const t = KITCHEN_COUNTERS.find((o) => o.id === ctr)?.designId;
    if (c) designStore.setFinish("kitchen", "cabinet", c);
    if (t) designStore.setFinish("kitchen", "counter", t);
    setMsg(c ? "Saved to the Kitchen in your finish schedule." : "Counter saved to the Kitchen. White paint is not in the cabinet palette, so cabinets were left unchanged.");
  };

  return (
    <section className="wrap section" aria-labelledby="kitchen-restyle">
      <h2 id="kitchen-restyle" className="text-[28px]">Restyle a real kitchen</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Pick cabinets and counters, then drag the divider to compare the kitchen as photographed with your version.</p>
      <div className="mt-5 grid gap-8 lg:grid-cols-[65fr_35fr]">
        <div className="min-w-0">
          <div className="aspect-[3/2] w-full bg-secondary">
            <ReactCompareSlider
              className="h-full w-full"
              itemOne={<ReactCompareSliderImage src={KITCHEN_ORIGINAL} alt="Kitchen as photographed: white shaker cabinets, white marble counters, wood island base" />}
              itemTwo={<ReactCompareSliderImage src={after} alt={`Same kitchen with ${cabName.toLowerCase()} cabinets and ${ctrName.toLowerCase()} counters`} />}
            />
          </div>
          <div className="mt-2 flex justify-between text-[14px] font-semibold"><span>As photographed</span><span>Your version</span></div>
          <p className="mt-2 text-[13px] text-muted-foreground"><a href={KITCHEN_CREDIT.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{KITCHEN_CREDIT.label}</a>. Your version is digitally edited from the same photograph; it is not an Oakline project. Colors vary by display and lighting.</p>
        </div>
        <div className="space-y-6">
          <fieldset><legend className="text-[20px]">Cabinets</legend>
            <div className="mt-3 grid gap-2">{KITCHEN_CABINETS.map((o) => <Choice key={o.id} active={cab === o.id} label={o.name} onClick={() => setCab(o.id)} />)}</div>
          </fieldset>
          <fieldset><legend className="text-[20px]">Counters</legend>
            <div className="mt-3 grid gap-2">{KITCHEN_COUNTERS.map((o) => <Choice key={o.id} active={ctr === o.id} label={o.name} onClick={() => setCtr(o.id)} />)}</div>
          </fieldset>
          <div>
            <Button className="min-h-11" onClick={save}>Save to my finish schedule</Button>
            <p className="mt-2 text-[13px] text-muted-foreground" role="status">{msg || "Choices are saved in this browser only."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
