import { useEffect, useRef } from "react";
import { Link } from "react-router";

import { cn } from "../lib/utils";

const MagneticButton = ({
  children,
  className,
  href,
  rel,
  target,
  to,
  type = "button",
  variant = "primary",
  ...props
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const currentElement = ref.current;

      if (!currentElement) {
        return;
      }

      const bounds = currentElement.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;

      currentElement.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
    };

    const resetPosition = () => {
      const currentElement = ref.current;

      if (currentElement) {
        currentElement.style.transform = "translate3d(0, 0, 0)";
      }
    };

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", resetPosition);
    element.addEventListener("pointerup", resetPosition);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", resetPosition);
      element.removeEventListener("pointerup", resetPosition);
    };
  }, []);

  const sharedClassName = cn("magnetic-button", variant === "secondary" && "secondary", className);

  if (to) {
    return (
      <Link ref={ref} to={to} className={sharedClassName} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} target={target} rel={rel} className={sharedClassName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} className={sharedClassName} {...props}>
      {children}
    </button>
  );
};

export default MagneticButton;
