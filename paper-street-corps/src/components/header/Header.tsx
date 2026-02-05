import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import DropdownMenu from './DropdownMenu';
import { NAV_TABS } from './navData';

export default function Header() {
  const { toggle } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <header
      className="sticky top-0 z-40 w-full
                 bg-white dark:bg-navy
                 border-b dark:border-gray-800"
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="text-xl font-bold text-black dark:text-white">
          Paper Street Corps
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {NAV_TABS.map((tab, index) => (
            <div
              key={tab.path}
              className="relative"
              onMouseEnter={() => tab.dropdown && setOpenIndex(index)}
              onMouseLeave={() => setOpenIndex(null)}
            >
              <NavLink
                to={tab.path}
                end
                className={({ isActive }) =>
                  [
                    'relative pb-1 outline-none',
                    'text-orange dark:text-yellow hover:text-green',
                    'focus-visible:ring-2 focus-visible:ring-orange',
                    isActive
                      ? 'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-orange'
                      : ''
                  ].join(' ')
                }
              >
                {tab.label}
              </NavLink>

              {tab.dropdown && openIndex === index && (
                <DropdownMenu items={tab.dropdown} />
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-1 rounded-full border dark:border-gray-600">
            Log in
          </button>
          <button className="px-4 py-1 rounded-full border dark:border-gray-600">
            Sign up
          </button>
          <button onClick={toggle} aria-label="Toggle theme">
            🌓
          </button>
        </div>
      </div>
    </header>
  );
}
