import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ModeToggle = () => {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modal tashqarisini bosganda yopish
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-transparent hover:bg-white    p-2 rounded-md cursor-pointer"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-white hover:text-black dark:hidden" />
        <Moon className="h-[1.2rem] w-[1.2rem] text-white hover:text-black hidden dark:block" />
      </button>

      {/* Dropdown content */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 
                     border-2 border-blue-500 rounded-md shadow-lg z-[15000]"
        >
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
          >
            Light
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
          >
            Dark
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setTheme("system");
              setOpen(false);
            }}
          >
            System
          </button>
        </div>
      )}
    </div>
  );
};

export default ModeToggle;
