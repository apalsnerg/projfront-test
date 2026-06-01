import { useState } from "react";
import { useParams } from "react-router-dom";
import { createFilePayload, isFilenameUnique } from "../models/file";
import { createFile } from "../services/fileService";

function CreateFileForm({ files, onFileCreated }) {
  const [filename, setFilename] = useState("");

  const [error, setError] = useState("");
  const { uid } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uid) {
      setError("No project selected");

      return;
    }

    if (!filename.trim()) {
      setError("Filename is required");

      return;
    }

    const validFilename = /^([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+|\.(env|gitignore))$/;

    if (!validFilename.test(filename.trim())) {
      setError("Invalid filename. Example: index.js or .env");

      return;
    }

    if (!isFilenameUnique(filename, files)) {
      setError("File with this name already exists");

      return;
    }

    setError("");

    const payload = createFilePayload(filename, uid);

    try {
      await createFile(payload);

      setFilename("");

      onFileCreated();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input
          id="filename"
          type="text"
          placeholder="Enter filename..."
          value={filename}
          onChange={(e) => {
            setFilename(e.target.value);

            setError("");
          }}
          className={`
            input-field
            input-field-compact
            ${error ? "input-field-error" : ""}
            max-w-[180px]
            text-sm
          `}
        />
        {error && <p className="text-error">{error}</p>}
      </form>
    </div>
  );
}

export default CreateFileForm;
