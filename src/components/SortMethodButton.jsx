function SortMethodButton({ label, sortKey, onSelect }) {
  return (
    <button
      onClick={() => onSelect(sortKey)}
      className="
        block
        w-full
        text-left
        px-4
        py-2
        text-gray-300
        hover:text-cyan-400
        hover:bg-gray-700/40
        transition-colors
      "
    >
      {label}
    </button>
  );
}

export default SortMethodButton;
