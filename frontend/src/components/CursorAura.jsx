import { useEffect, useState } from "react";

import { cn } from "../lib/utils";

const CursorAura = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      setPosition({ x: event.clientX - 11, y: event.clientY - 11 });
      setIsVisible(true);
    };
    const activate = () => setIsActive(true);
    const deactivate = () => setIsActive(false);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", activate);
    window.addEventListener("pointerup", deactivate);
    window.addEventListener("pointerleave", deactivate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("pointerup", deactivate);
      window.removeEventListener("pointerleave", deactivate);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn("cursor-aura", isActive && "is-active", !isVisible && "opacity-0")}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    />
  );
};

export default CursorAura;
