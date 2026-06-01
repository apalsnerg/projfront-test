import { useState } from "react";
import { deleteFile } from "../services/fileService";
import { getCurrentUserEmail } from "../models/token";
import { useNavigate } from "react-router";
import { getFiletypeIcon } from "../utils/color";
import { determineFileExtension } from "../models/file";

function FileList({ files, setFiles }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const currentUser = getCurrentUserEmail();

  const navigate = useNavigate();

  const handleDeleteClick = (file, e) => {
    e.stopPropagation();
    setSelectedFile(file);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFile(selectedFile.uid);

      setFiles((prev) => prev.filter((f) => f.uid !== selectedFile.uid));

      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    }
  };

  if (files.length === 0) {
    return <p>No files found</p>;
  }

  const handleClick = (e) => {
    const fid = e.target.parentNode.getAttribute("fid");
    navigate(`file/${fid}`);
  };

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Filename</th>
            <th className="text-left p-2">Creator</th>
            <th className="text-left p-2">Last changed</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const lastChanged = new Date(file.last_changed).toLocaleDateString();
            const filetype = determineFileExtension(file.filename);

            if (filetype === "folder") return;

            return (
              <tr
                key={file.uid}
                onClick={handleClick}
                fid={file.uid}
                className="cursor-pointer file-item"
              >
                <td className="p-2 flex gap-1">
                  <img
                    height="16"
                    width="16"
                    src={import.meta.env.BASE_URL + "icons/" + getFiletypeIcon(filetype)}
                    alt={filetype}
                  ></img>
                  {file.filename}
                </td>
                <td className="p-2">{file.created_by}</td>
                <td className="p-2">{lastChanged}</td>
                <td className="p-2 text-right">
                  {file.created_by === currentUser && (
                    <button
                      onClick={(e) => handleDeleteClick(file, e)}
                      className="cursor-pointer"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80 text-black">
            <p className="mb-4">
              Are you sure you want to delete <strong>{selectedFile?.filename}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileList;
