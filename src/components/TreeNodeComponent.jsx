import { useNavigate, useParams } from "react-router";
import { getFiletypeIcon } from "../utils/color";
import { determineFileExtension } from "../models/file";

export function TreeNode({ data }) {
  const { uid } = useParams();
  const navigate = useNavigate();

  if (data.isFolder) {
    return (
      <li>
        <p className="text">📁{data.filename}</p>
        <ul className="pl-2">
          {data.children.map((child) => {
            return (
              <TreeNode
                key={child.uid}
                data={child}
              ></TreeNode>
            );
          })}
        </ul>
      </li>
    );
  }

  const openFileInEditor = (e) => {
    e.stopPropagation();
    navigate(`/projects/${uid}/file/${data.uid}`);
  };

  const filetype = determineFileExtension(data.filename);

  return (
    <li className="pl-2">
      <button
        className="
          cursor-pointer
          flex
          items-center
          gap-1
          text-left
          hover:text-cyan-400
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500
          rounded
          w-full
        "
        onClick={openFileInEditor}
      >
        <img
          height="16"
          width="16"
          src={import.meta.env.BASE_URL + "icons/" + getFiletypeIcon(filetype)}
          alt={filetype}
        />
        <span
          className="
            text-sm
            block
            truncate
          "
        >
          {data.filename}
        </span>
      </button>
    </li>
  );
}
