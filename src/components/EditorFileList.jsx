import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { filterFilesByProject } from "../models/file";
import { getFiles } from "../services/fileService";
import { TreeNode } from "./TreeNodeComponent";
import CreateFileForm from "./CreateFileForm";

export function EditorFileList({ onAddFile, showCreateFile, onFileCreated, refreshTrigger }) {
  const { uid } = useParams();
  const [files, setFiles] = useState([]);
  const [FIDToName, setFIDToName] = useState({});
  /* eslint-disable-next-line no-unused-vars */
  const [nameToFID, setNameToFID] = useState({});
  const [error, setError] = useState(null);
  const [fileTree, setFileTree] = useState([]);

  useEffect(() => {
    const getProjectFiles = async () => {
      try {
        const data = await getFiles(uid);
        const projectFiles = filterFilesByProject(data, uid);
        const fileTree = [];
        const filenameTable = {};
        const fidTable = {};
        projectFiles.forEach((file) => {
          filenameTable[file.uid] = file.filename;
          fidTable[file.filename] = file.uid;
        });
        setFIDToName(filenameTable);
        setNameToFID(fidTable);

        const fileRelationships = {};
        const roots = [];
        // create a list of every file that another file claims to be its parent
        projectFiles.forEach((file) => {
          if (file.parent_file) {
            if (!fileRelationships[file.parent_file]) fileRelationships[file.parent_file] = [];
            fileRelationships[file.parent_file].push(file.uid);
          } else if (!Object.keys(fileRelationships).includes(file.uid)) {
            fileRelationships[file.uid] = [];
          }
          // all files which lack a parent file are root files
          if (!file.parent_file) {
            roots.push(file.uid);
          }
        });

        /**
         * Builds a tree by recursively checking if a given file is a parent of another file or a leaf. Requires that the parent be a root file, or otherwise a known parent file.
         * @param {String} parent - the uid of the parent file
         * @returns {Object[]} - an array of objects that represent the files in this subtree
         */
        function buildFileTreeBranch(parent) {
          const children = fileRelationships[parent];

          const subtree = [];
          for (let child of children) {
            if (fileRelationships[child]) {
              subtree.push({
                filename: filenameTable[child],
                uid: child,
                isFolder: true,
                children: buildFileTreeBranch(child),
              });
            } else {
              subtree.push({
                filename: filenameTable[child],
                uid: child,
                isFolder: false,
                children: [],
              });
            }
          }
          return subtree;
        }

        for (let root of roots) {
          if (fileRelationships[root].length === 0) {
            fileTree.push({
              filename: filenameTable[root],
              uid: root,
              isFolder: false,
              children: [],
            });
          } else {
            fileTree.push({
              filename: filenameTable[root],
              uid: root,
              isFolder: true,
              children: buildFileTreeBranch(root),
            });
          }
        }
        setFileTree(fileTree);
        setFiles(projectFiles);
      } catch (err) {
        setError(err.message);
      }
    };

    getProjectFiles();
  }, [uid, refreshTrigger]);

  if (error) return <p>{error}</p>;
  if (!files) return <p>Loading files...</p>;
  if (files && files.length === 0) return <p>No files found</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2
          className="
            text-gray-300
            text-base
            font-semibold
          "
        >
          Project files
        </h2>

        <button
          onClick={onAddFile}
          className="
            text-cyan-400
            hover:text-cyan-300
            font-bold
            text-xl
            leading-none
            cursor-pointer
          "
          aria-label="Add file"
          title="Add file"
        >
          +
        </button>
      </div>

      {showCreateFile && (
        <div className="mb-4">
          <CreateFileForm
            files={files}
            onFileCreated={onFileCreated}
          />
        </div>
      )}

      <ul className="space-y-1">
        {fileTree.map((fileBranch) => (
          <TreeNode
            key={fileBranch.uid}
            data={fileBranch}
          />
        ))}
      </ul>
    </div>
  );
}
