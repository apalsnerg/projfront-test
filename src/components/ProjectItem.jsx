import { useNavigate } from "react-router-dom";
import sharedActive from "../assets/icons/shared-active.png";
import sharedInactive from "../assets/icons/shared-inactive.png";

/**
 * Component to display a single project item in the project list.
 * @param {Object} props.project - The project data to display.
 * @param {string} props.project.uid - The unique identifier of the project.
 * @param {string} props.project.name - The name of the project.
 * @param {Array} props.project.users - The users associated with the project.
 * @returns {JSX.Element} The component.
 */

function ProjectItem({ project }) {
  const navigate = useNavigate();
  const isShared = project.users && project.users.length > 1;

  return (
    <li>
      <button
        onClick={() => navigate(`/projects/${project.uid}`)}
        className="
          project-item
          flex
          justify-between
          transition
          duration-200
          hover:scale-[1.01]
          hover:border-cyan-400
          cursor-pointer
          w-full
          text-left
        "
      >
        {project.name}

        <img
          src={isShared ? sharedActive : sharedInactive}
          alt={isShared ? "Shared project" : "Private project"}
          className="shared-icon"
          width={25}
        />
      </button>
    </li>
  );
}

export default ProjectItem;
