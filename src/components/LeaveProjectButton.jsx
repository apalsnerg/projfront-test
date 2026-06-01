import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserEmail } from "../models/token";
import { removeUserFromProject, getProjectById, deleteProject } from "../services/projectService";

/**
 * Button component for leaving a project.
 * @param {string} props.uid - The unique identifier of the project.
 * @returns {JSX.Element}
 */

function LeaveProjectButton({ uid }) {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLeaveProject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this project? You will lose access unless another user adds you again.",
    );

    if (!confirmed) {
      return;
    }

    const email = getCurrentUserEmail();

    try {
      const project = await getProjectById(uid);

      // If user is the last member, delete project. Otherwise, just remove user from project.
      // This prevents ghost projects in the database.
      if (project.users.length === 1) {
        await deleteProject(uid);
        alert("You were the last member of the project, so it has been deleted.");
      } else {
        await removeUserFromProject(uid, email);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <button
        className="button button-amber"
        onClick={handleLeaveProject}
      >
        Leave Project
      </button>
      {error && <p className="text-error mt-2">{error}</p>}
    </div>
  );
}

export default LeaveProjectButton;
