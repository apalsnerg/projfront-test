import { Link } from "react-router-dom";

function Breadcrumbs({ items }) {
  return (
    <nav
      className="
        text-sm
        text-gray-400
        mb-4
      "
    >
      {items.map((item, index) => (
        <span key={item.label}>
          {item.path ? (
            <Link
              to={item.path}
              className="
                hover:text-white
                transition-colors
              "
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}

          {index < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
