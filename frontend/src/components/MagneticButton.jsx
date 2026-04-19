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
  const sharedClassName = cn("magnetic-button", variant, className);

  if (to) {
    return (
      <Link to={to} className={sharedClassName} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={sharedClassName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={sharedClassName} {...props}>
      {children}
    </button>
  );
};

export default MagneticButton;
