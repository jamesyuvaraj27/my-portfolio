import { Menu, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { NAV_ITEMS, PROFILE } from "../lib/site";
import { cn } from "../lib/utils";

const NavBar = ({ logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const closeMenu = () => setIsOpen(false);
  const handleAnchorClick = (event, href) => {
    const target = document.querySelector(href);

    if (!target) {
      closeMenu();
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
    closeMenu();
  };

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(Boolean);

    if (sections.length === 0) {
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
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-full mx-4 my-4 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <a href="#home" className="flex items-center gap-3" onClick={(event) => handleAnchorClick(event, "#home")}> 
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-11 w-11 rounded-[1.25rem] border border-white/10 object-cover shadow-[0_12px_30px_rgba(20,184,166,0.28)]"
                />
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-sm font-bold text-white shadow-[0_12px_30px_rgba(20,184,166,0.28)]">
                  {PROFILE.brand.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-300">{PROFILE.brand}</p>
                <p className="text-xs text-slate-500">MERN Developer Portfolio</p>
              </div>
            </a>

            <div className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleAnchorClick(event, item.href)}
                  aria-current={activeId === item.href.slice(1) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white",
                    activeId === item.href.slice(1) && "bg-cyan-400/10 text-cyan-100"
                  )}
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle navigation"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 lg:hidden"
              onClick={() => setIsOpen((current) => !current)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div
            className={cn(
              "grid overflow-hidden transition-all duration-300 lg:hidden",
              isOpen ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0">
              <div className="grid gap-2 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-3">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => handleAnchorClick(event, item.href)}
                    aria-current={activeId === item.href.slice(1) ? "page" : undefined}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.05]",
                      activeId === item.href.slice(1) && "bg-cyan-400/10 text-cyan-100"
                    )}
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200"
                >
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
