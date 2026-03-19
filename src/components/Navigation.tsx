import { useState, useEffect } from 'react';
import { ScheduleCallButton } from './ScheduleCallButton';
import logo from 'figma:asset/01ab4ddf9498ad72150c22c58a71c1af4fd5772b.png';

// ── Inline SVG Icons (STRICT: no lucide-react) ──

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const RocketIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const UserIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ── Nav link data ──

const NAV_LINKS = [
  { label: 'Work', href: 'https://bktadvisory.com/work' },
  { label: 'Services', href: 'https://bktadvisory.com/services' },
  { label: 'Process', href: 'https://bktadvisory.com/process' },
  { label: 'About', href: 'https://bktadvisory.com/about' },
];

export function Navigation({
  onNavigateToEstimator,
}: {
  onNavigateToEstimator: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-[#EFF6FF]/90 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-nowrap h-[80px]">

          {/* ── Logo (left) ── */}
          <div className="shrink-0">
            <a href="https://bktadvisory.com" className="block">
              {/* Full horizontal logo: xl+ */}
              <img
                src={logo}
                alt="BKT Advisory Logo"
                className="h-[52px] w-auto hidden xl:block"
              />
              {/* Shield icon: below xl */}
              <img
                src="https://hjrvtzkktodoxigezxqy.supabase.co/storage/v1/object/public/Logos/BKT%20Advisory%20-%20Icon%20Logo%20(Transparent).png"
                alt="BKT Advisory"
                className="h-[52px] w-auto block xl:hidden"
              />
            </a>
          </div>

          {/* ── Desktop Nav (lg+) ── */}
          <div className="hidden lg:flex items-center flex-nowrap">
            {/* Nav links */}
            <div className="flex items-center gap-1 xl:gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative whitespace-nowrap px-3 py-2 text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-700 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              ))}
            </div>

            {/* Vertical divider */}
            <div className="w-px h-6 bg-slate-300/70 mx-1 xl:mx-2 shrink-0" />

            {/* CTA cluster */}
            <div className="flex items-center gap-2 xl:gap-3">
              {/* Project Estimator */}
              <a
                href="https://estimator.bktadvisory.com"
                className="inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <RocketIcon />
                <span className="hidden xl:inline whitespace-nowrap">Project Estimator</span>
                <span className="inline xl:hidden whitespace-nowrap">Estimator</span>
              </a>

              {/* Schedule Strategy Call */}
              <ScheduleCallButton variant="nav">
                <CalendarIcon />
                <span className="whitespace-nowrap cursor-pointer">Schedule Strategy Call</span>
              </ScheduleCallButton>

              {/* Sign In */}
              <a
                to="https://bktadvisory.com/auth"
                className="whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-400 rounded-lg transition-all duration-200 relative group cursor-pointer"
              >
                <UserIcon size={15} />
                Sign In
                <span className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-blue-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>

              
            </div>
          </div>

          {/* ── Mobile Hamburger (below lg) ── */}
          <div className="lg:hidden flex items-center gap-2 ml-auto">
            {/* Mobile Sign In */}
            <a
              href="https://bktadvisory.com/auth"
              className="whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-400 rounded-lg transition-all duration-200 relative group"
            >
              <UserIcon size={15} />
              <span className="whitespace-nowrap">Sign In</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-700 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-800 hover:text-slate-600 transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-[80px] bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer panel */}
          <div className="lg:hidden fixed left-0 right-0 top-[80px] z-50 bg-[#EFF6FF]/98 backdrop-blur-xl border-b border-blue-100 shadow-xl">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5">
              {/* Nav links */}
              <div className="flex flex-col gap-1 mb-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="whitespace-nowrap px-3 py-2.5 text-sm font-medium text-slate-800 hover:text-blue-700 hover:bg-blue-50/60 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-200/80 my-3" />

              {/* CTAs stacked */}
              <div className="flex flex-col gap-2.5">
                {/* Project Estimator */}
                <a
                  href="https://estimator.bktadvisory.com"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-200"
                >
                  <RocketIcon />
                  <span className="whitespace-nowrap">Project Estimator</span>
                </a>

                {/* Schedule Strategy Call */}
                <ScheduleCallButton variant="nav">
                  <CalendarIcon />
                  <span className="whitespace-nowrap">Schedule Strategy Call</span>
                </ScheduleCallButton>

                {/* Sign In */}
                <a
                  href="https://bktadvisory.com/auth"
                  onClick={() => setIsOpen(false)}
                  className="whitespace-nowrap inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-400 rounded-lg transition-all duration-200 relative group"
                >
                  <UserIcon size={15} />
                  <span className="whitespace-nowrap">Sign In</span>
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-blue-700 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}