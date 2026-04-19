import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "../../lib/utils";

export const Modal = ({
  children,
  className = "",
  description,
  isOpen,
  onClose,
  title,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button type="button" className="modal-backdrop" aria-label="Close modal" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className={cn("modal-panel p-6 sm:p-7", className)}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold tracking-[-0.02em] text-text-primary">
              {title}
            </h2>
            {description ? (
              <p id="modal-description" className="mt-2 text-sm text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-secondary-300 bg-white text-text-secondary transition hover:border-primary-200 hover:text-primary-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </>
  );
};

export default Modal;
