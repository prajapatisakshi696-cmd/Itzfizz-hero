import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Car from "./Car";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZFIZZ";

// Order here = the order the cards appear while scrolling
const STATS = [
  { value: "58%", label: "Increase in pick up point use", cls: "bg-[#dff54e] text-[#111]", row: "top" },
  { value: "23%", label: "Decreased in customer phone calls", cls: "bg-[#6cc8ff] text-[#111]", row: "bottom" },
  { value: "27%", label: "Increase in pick up point use", cls: "bg-[#333] text-white", row: "top" },
  { value: "40%", label: "Decreased in customer phone calls", cls: "bg-[#f97316] text-[#111]", row: "bottom" },
];

function Card({ value, label, cls, index }) {
  return (
    <div
      data-stat={index}
      className={`stat w-[42vw] max-w-[390px] rounded-2xl px-6 py-7 will-change-transform ${cls}`}
    >
      <div className="text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-none">{value}</div>
      <p className="mt-3 text-[clamp(.8rem,1.3vw,1.15rem)]">{label}</p>
    </div>
  );
}

export default function Hero() {
  const root = useRef(null);
  const car = useRef(null);
  const trail = useRef(null);
  const inner = useRef(null);

  useEffect(() => {
    // Capture elements once; GSAP functions below never touch ref.current
    const rootEl = root.current;
    const carEl = car.current;
    const trailEl = trail.current;
    const innerEl = inner.current;
    if (!rootEl || !carEl || !trailEl || !innerEl) return;

    const W = () => rootEl.clientWidth;
    const carW = () => carEl.offsetWidth;

    // Green edge sits 18% into the car, same as the reference.
    const carEnd = () => W() - 0.45 * carW();   // car ends partly off-screen
    const trailStart = () => 0.18 * carW() - W();
    const trailEnd = () => carEnd() + 0.18 * carW() - W();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load: only the road band fades in. The page starts almost empty.
        gsap.from(".band", { opacity: 0, y: 24, duration: 1, ease: "power3.out" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1,               // smooth catch-up to scroll position
            invalidateOnRefresh: true,
          },
        });

        // Car and green trail move together, left to right
        tl.fromTo(carEl, { x: 0 }, { x: carEnd }, 0)
          .fromTo(trailEl, { x: trailStart }, { x: trailEnd }, 0)
          // headline moves the opposite way, so it stays still while the trail reveals it
          .fromTo(innerEl, { x: () => -trailStart() }, { x: () => -trailEnd() }, 0);

        // Stats appear one by one as you scroll
        STATS.forEach((_, i) => {
          tl.fromTo(
            `[data-stat="${i}"]`,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.12, ease: "power3.out" },
            0.2 + i * 0.20
          );
        });
      });
    }, rootEl);

    return () => ctx.revert();
  }, []);

  const renderRow = (row) =>
    STATS.map((s, i) => (s.row === row ? <Card key={s.value} index={i} {...s} /> : null));

  return (
    <div>
      <main ref={root} className="relative flex h-screen flex-col justify-center overflow-hidden">
        {/* Top cards */}
        <div className="flex justify-end gap-5 px-[5vw] pb-[7vh]">{renderRow("top")}</div>

        {/* Road band */}
        <div className="band relative h-[26vh] min-h-[130px] overflow-hidden bg-[#1f1f1f]">
          {/* Green trail with the headline inside it */}
          <div ref={trail} className="absolute inset-0 overflow-hidden bg-[#46dc7e] will-change-transform">
            <h1
              ref={inner}
              aria-label={HEADLINE}
              className="absolute inset-0 flex items-center whitespace-nowrap pl-[4vw] text-[clamp(2rem,7.6vw,8rem)] font-extrabold tracking-[0.06em] text-[#111] will-change-transform"
            >
              {[...HEADLINE].map((c, i) => (
                <span key={i} aria-hidden="true" className="inline-block">
                  {c === " " ? "\u00A0\u00A0" : c}
                </span>
              ))}
            </h1>
          </div>

          {/* Car */}
          <div ref={car} className="absolute left-0 top-0 flex h-full items-center will-change-transform">
            <Car />
          </div>
        </div>

        {/* Bottom cards */}
        <div className="flex justify-end gap-5 px-[10vw] pt-[7vh]">{renderRow("bottom")}</div>
      </main>
    </div>
  );
}