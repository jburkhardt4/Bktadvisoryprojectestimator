import { useState } from 'react';

// Icon components to avoid lucide-react import issue
const MenuIcon = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

import logo from 'figma:asset/01ab4ddf9498ad72150c22c58a71c1af4fd5772b.png';
import mobileLogo from 'figma:asset/0e0a121653cc931918711be760206409b22eeac2.png';
import { ScheduleCallButton } from './ScheduleCallButton';

export function Navigation({ 
  onNavigateToEstimator
}: { 
  onNavigateToEstimator: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#EFF6FF]/90 backdrop-blur-md border-b border-blue-100 px-[20px] py-[0px]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[116px]">
          {/* Logo */}
          <div className="py-4">
            <a href="https://bktadvisory.com" className="block">
              <img src={logo} alt="BKT Advisory Logo" className="hidden md:block h-[68px] w-auto" />
              <img src={mobileLogo} alt="BKT Advisory Logo" className="block md:hidden h-[60px] w-auto" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="https://bktadvisory.com/#work" className="text-slate-900 hover:text-blue-700 transition-colors relative group">
              Work
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-700 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="https://bktadvisory.com/#services" className="text-slate-900 hover:text-blue-700 transition-colors relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-700 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="https://bktadvisory.com/#process" className="text-slate-900 hover:text-blue-700 transition-colors relative group">
              Process
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-700 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="https://bktadvisory.com/#about" className="text-slate-900 hover:text-blue-700 transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-700 group-hover:w-full transition-all duration-300"></span>
            </a>
            <span className="text-blue-700 font-medium relative group cursor-default">
              Project Estimator
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-700"></span>
            </span>
            <ScheduleCallButton variant="nav" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-900 hover:text-slate-700"
          >
            {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            <div className="flex flex-col gap-4">
              <a href="https://bktadvisory.com/#work" className="text-slate-900 hover:text-blue-700 transition-colors text-left">
                Work
              </a>
              <a href="https://bktadvisory.com/#services" className="text-slate-900 hover:text-blue-700 transition-colors text-left">
                Services
              </a>
              <a href="https://bktadvisory.com/#process" className="text-slate-900 hover:text-blue-700 transition-colors text-left">
                Process
              </a>
              <a href="https://bktadvisory.com/#about" className="text-slate-900 hover:text-blue-700 transition-colors text-left">
                About
              </a>
              <span className="text-blue-700 font-medium text-left">
                Project Estimator
              </span>
              <ScheduleCallButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}