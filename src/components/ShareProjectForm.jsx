import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addUserToProject } from "../services/projectService";

/**
 * Form component for sharing a project with another user.
 * Adds a user to the project via email.
 * @returns {JSX.Element} The component.
 */

function ShareProjectForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { uid } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");

      return;
    }

    try {
      await addUserToProject(uid, email);

      setSuccess("User added successfully");

      setEmail("");

      setTimeout(() => {
        navigate(`/projects/${uid}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full"
      >
        <label
          htmlFor="email"
          className="text font-medium"
        >
          Add user to project
        </label>

        <input
          id="email"
          type="text"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);

            setError("");
            setSuccess("");
          }}
          className={error ? "input-field input-field-error" : "input-field"}
        />

        {error && <p className="text-error">{error}</p>}

        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="button button-cyan"
        >
          Add User
        </button>
      </form>
    </div>
  );
}

export default ShareProjectForm;
