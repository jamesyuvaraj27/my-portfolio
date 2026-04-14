import { useEffect, useRef, useState } from "react";

const SkillMeter = ({ skill }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{skill.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{skill.category}</p>
        </div>
        <span className="text-sm font-semibold text-cyan-200">{skill.level}%</span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-900/80">
        <div
          className="h-full rounded-full bg-[linear-gradient(135deg,#14b8a6,#f472b6,#facc15)] transition-all duration-[1400ms] ease-out"
          style={{ width: visible ? `${skill.level}%` : "0%" }}
        />
      </div>
    </div>
  );
};

export default SkillMeter;
