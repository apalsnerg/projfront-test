import { useState } from "react";
import { createProject } from "../services/projectService";

/**
 * Form component for creating a new project.
 * Posts project name to API
 * @param {string} projectName - The name of the project to be created
 * @param {function} handleSubmit - Function to handle form submission
 * @returns JSX element with form
 */

function CreateProjectForm({ onProjectCreated }) {
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");

  /**
   * Handles form submission
   * Creates a new project via API and navigates to dashboard on success
   * Resets input
   * @param formEvent e - The form submission event
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await createProject(projectName);

      onProjectCreated?.();

      setProjectName("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <input
            id="projectName"
            type="text"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);

              setError("");
            }}
            className="input-field"
          />

          <button
            type="submit"
            className="button button-cyan"
          >
            Create
          </button>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default CreateProjectForm;
