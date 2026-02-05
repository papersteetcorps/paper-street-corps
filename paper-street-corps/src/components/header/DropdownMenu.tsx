import { NavLink } from 'react-router-dom';

interface Item {
  label: string;
  path: string;
}

export default function DropdownMenu({ items }: { items: Item[] }) {
  return (
    <div
      className="absolute top-full left-0 mt-2 min-w-[200px]
                 rounded-md border shadow-lg
                 bg-white dark:bg-navy
                 dark:border-gray-700
                 animate-dropdown"
    >
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className="block px-4 py-2 text-sm
                     text-gray-800 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
