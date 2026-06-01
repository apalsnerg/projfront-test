import { Link } from "react-router-dom";
import Logout from "./Logout";
import logo from "../assets/logo/logo-icon.svg";

function Header() {
  return (
    <header className="bg-main border-b border-[var(--border-color)] px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Coed One logo"
            className="w-8 h-8"
          />

          <span className="text-lg font-semibold">Coed One</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="hover:text-cyan-300 transition-colors"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="hover:text-cyan-300 transition-colors"
            >
              Profile
            </Link>
          </nav>

          <Logout />
        </div>
      </div>
    </header>
  );
}

export default Header;
