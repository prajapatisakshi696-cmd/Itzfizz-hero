import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Car from "./Car";
 
gsap.registerPlugin(ScrollTrigger);
 
const HEADLINE = "WELCOME ITZFIZZ";
 
const CAR_HEIGHT = "135%";
const CAR_OFFSCREEN = 0.45;
const TRAIL_LEAD = 0.28;
 
const TOP = [
  { value: "58%", label: "Increase in pick up point use", cls: "bg-[#dfff54] text-[#111] sm:w-[19vw]" },
  { value: "27%", label: "Increase in pick up point use", cls: "bg-[#333] text-white sm:w-[17.3vw]" },
];
const BOTTOM = [
  { value: "23%", label: "Decreased in customer phone calls", cls: "bg-[#72cffc] text-[#111] sm:w-[20.5vw]" },
  { value: "40%", label: "Decreased in customer phone calls", cls: "bg-[#ec6a2b] text-[#111] sm:w-[20.5vw]" },
];
 
function Card({ value, label, cls }) {
  return (
    <div
      className={`stat flex min-h-[19vh] w-[44vw] flex-col justify-center rounded-xl px-5 py-4 will-change-transform sm:px-[2vw] ${cls}`}
    >
      <div className="text-[clamp(2.2rem,4vw,4.5rem)] font-bold leading-none">{value}</div>
      <p className="mt-[1.2vh] text-[clamp(.75rem,1.15vw,1.2rem)] leading-tight">{label}</p>
    </div>
  );
}
 

const headlineClass =
  "absolute inset-0 flex items-center whitespace-nowrap pl-[4.5vw] text-[8.4vw] font-bold leading-none tracking-[0.1em]";
 
function Letters({ colorClass, animated }) {
  return [...HEADLINE].map((c, i) => (
    <span key={i} aria-hidden="true" className={`${animated ? "ch" : ""} inline-block ${colorClass}`}>
      {c === " " ? "\u00A0\u00A0" : c}
    </span>
  ));
}
 
export default function Hero() {
  const root = useRef(null);
  const trail = useRef(null);
  const trailInner = useRef(null);
  const car = useRef(null);
 
  useEffect(() => {
    const rootEl = root.current;
    const trailEl = trail.current;
    const innerEl = trailInner.current;
    const carEl = car.current;
    if (!rootEl || !trailEl || !innerEl || !carEl) return;
 

    let W = 0;
    let carW = 0;
    let progress = 0;
 
    const measure = () => {
      W = rootEl.clientWidth;
      carW = carEl.offsetWidth;
    };
 

    const apply = (p = progress) => {
      progress = p;
      const carX = p * (W - carW * (1 - CAR_OFFSCREEN));
      const edge = Math.min(W, carX + carW * TRAIL_LEAD * p);
      carEl.style.transform = `translate3d(${carX}px,0,0)`;
      trailEl.style.transform = `translate3d(${edge - W}px,0,0)`;
      innerEl.style.transform = `translate3d(${W - edge}px,0,0)`;
    };
 
    measure();
    const ro = new ResizeObserver(() => {
      measure();
      apply();
    });
    ro.observe(carEl); 
    ro.observe(rootEl);
 
    const mm = gsap.matchMedia(rootEl);
 
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { p: 0 };
      apply(0);
 
      
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".ch", { yPercent: 60, opacity: 0, duration: 1, stagger: 0.06 })
        .from(".stat", { y: 40, opacity: 0, duration: 0.9, stagger: 0.18 }, "-=0.5");
 
      
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(state, { p: 1, duration: 1, onUpdate: () => apply(state.p) }, 0)
        .to(".row-top", { y: -24 }, 0)
        .to(".row-bottom", { y: 24 }, 0);
    });
 
    mm.add("(prefers-reduced-motion: reduce)", () => {
      apply(1);
    });
 
    return () => {
      ro.disconnect();
      mm.revert();
      carEl.style.transform = "";
      trailEl.style.transform = "";
      innerEl.style.transform = "";
    };
  }, []);
 
  return (
    <main
      ref={root}
      className="relative flex h-screen flex-col justify-center gap-[8vh] overflow-hidden bg-[#d0d0d0] pb-[6vh] font-[Arial,Helvetica,sans-serif]"
    >
      {/* Top cards */}
      <div className="row-top flex justify-end gap-[2.7vw] pr-[5vw] sm:pr-[11vw]">
        {TOP.map((s) => (
          <Card key={s.value} {...s} />
        ))}
      </div>
 
      {/* Road band */}
      <div className="relative z-10 h-[26vh] min-h-[120px] bg-[#1c1c1c]">
        <h1 className={headlineClass} aria-label={HEADLINE}>
          <Letters colorClass="text-[#f2f2f2]/90" animated />
        </h1>
 
        <div
          ref={trail}
          className="absolute inset-0 overflow-hidden bg-[#4ff082] will-change-transform"
          style={{ transform: "translate3d(-100%,0,0)" }}
        >
          <div
            ref={trailInner}
            className={`will-change-transform ${headlineClass}`}
            style={{ transform: "translate3d(100%,0,0)" }}
            aria-hidden="true"
          >
            <Letters colorClass="text-[#111]" />
          </div>
        </div>
 
        {/* Layer 3: car */}
        <div ref={car} className="absolute left-0 top-0 flex h-full items-center will-change-transform">
          <Car height={CAR_HEIGHT} />
        </div>
      </div>
 
      {/* Bottom cards */}
      <div className="row-bottom flex justify-end gap-[2.1vw] pr-[5vw] sm:pr-[13.5vw]">
        {BOTTOM.map((s) => (
          <Card key={s.value} {...s} />
        ))}
      </div>
    </main>
  );
}