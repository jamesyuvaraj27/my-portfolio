import { Menu, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { NAV_ITEMS, PROFILE } from "../lib/site";
import { cn } from "../lib/utils";

const NavBar = ({ logoUrl }) => {
  const [activeId, setActiveId] = useState("home");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-24% 0px -56% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleAnchorClick = (event, href) => {
    const target = document.querySelector(href);

    if (!target) {
      setIsOpen(false);
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="container-shell">
        <div className="glass-panel flex items-center justify-between rounded-full px-4 py-3 sm:px-5">
          <a
            href="#home"
            onClick={(event) => handleAnchorClick(event, "#home")}
            className="flex items-center gap-3"
            aria-label={`${PROFILE.fullName} home`}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${PROFILE.fullName} logo`}
                className="h-11 w-11 rounded-2xl border border-white/90 object-cover shadow-sm"
              />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-500 text-sm font-bold text-white shadow-sm">
                {PROFILE.brand.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-[-0.01em] text-text-primary">{PROFILE.fullName}</p>
              <p className="text-xs text-text-secondary">{PROFILE.role}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleAnchorClick(event, item.href)}
                aria-current={activeId === item.href.slice(1) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeId === item.href.slice(1)
                    ? "bg-primary-500/10 text-primary-600"
                    : "text-text-secondary hover:bg-white/80 hover:text-text-primary"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/admin" className="magnetic-button secondary">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-secondary-300 bg-white/90 text-text-primary shadow-sm lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={cn(
            "grid overflow-hidden transition-all duration-300 lg:hidden",
            isOpen ? "grid-rows-[1fr] pt-3" : "grid-rows-[0fr]"
          )}
        >
          <div className="min-h-0">
            <div className="glass-panel rounded-3xl p-3">
              <nav className="grid gap-2" aria-label="Mobile primary">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => handleAnchorClick(event, item.href)}
                    aria-current={activeId === item.href.slice(1) ? "page" : undefined}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      activeId === item.href.slice(1)
                        ? "bg-primary-500/10 text-primary-600"
                        : "text-text-secondary hover:bg-white hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </a>
                ))}
                <Link to="/admin" onClick={() => setIsOpen(false)} className="magnetic-button secondary mt-1">
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
