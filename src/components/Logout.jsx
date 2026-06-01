import { useNavigate } from "react-router-dom";
import { logout } from "../models/auth";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="button button-cyan button-small"
    >
      Logout
    </button>
  );
}

export default Logout;
