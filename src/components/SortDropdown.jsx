import { useState, useEffect, useRef } from "react";
import SortMethodButton from "./SortMethodButton";

function SortDropdown({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (key) => {
    onSelect(key);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          px-4
          py-2
          rounded-lg
          border
          border-cyan-500
          text-cyan-400
          hover:bg-cyan-500
          hover:text-black
          transition-colors
          text-sm
          font-semibold
        "
      >
        Sort
      </button>

      {isOpen && (
        <div
          className="
            absolute
            mt-2
            w-40
            rounded-lg
            border
            border-[var(--border-color)]
            bg-gray-800
            py-1
            z-10
            shadow-lg
          "
        >
          <button
            onClick={() => handleSelect(null)}
            className="
              block
              w-full
              text-left
              px-3
              py-1.5
              text-sm
              text-gray-300
              hover:text-cyan-400
              hover:bg-gray-700/40
              transition-colors
            "
          >
            Reset
          </button>

          <SortMethodButton
            label="Filename"
            sortKey="filename"
            onSelect={handleSelect}
          />

          <SortMethodButton
            label="Creator"
            sortKey="created_by"
            onSelect={handleSelect}
          />

          <SortMethodButton
            label="Last changed"
            sortKey="last_changed"
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

export default SortDropdown;
