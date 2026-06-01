import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { getFiles } from "../services/fileService";
import { determineFileType, filterFilesByFID, filterFilesByProject } from "../models/file";
import { getProjectById } from "../services/projectService";
import ActiveUserList from "../components/ActiveUserList";
import GSocketInstance from "../services/socket";
import { ActiveUserContext } from "../contexts/ActiveUserContext";
import { getUserColor, hslToHex, usernameToHSL } from "../utils/color";
import Breadcrumbs from "../components/Breadcrumbs";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { EditorFileList } from "../components/EditorFileList";
import { getCurrentUserEmail } from "../models/token";
import CreateFileForm from "../components/CreateFileForm";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness";
import { getProfile } from "../services/profileService";

export default function EditorView() {
  const { uid, fid } = useParams();
  const { activeUsers } = useContext(ActiveUserContext);

  const [fileContent, setFileContent] = useState("");
  const [fileType, setFiletype] = useState("");
  const [currentFilename, setCurrentFilename] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved");
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateFile, setShowCreateFile] = useState(false);

  const ydoc = useRef(null);
  const editorRef = useRef(null);
  const timeoutRef = useRef(null);
  const awarenessRef = useRef(null);
  const monacoBinding = useRef(null);
  const displayName = useRef(null);

  useEffect(() => {
    const getFileData = async () => {
      try {
        const data = await getFiles(uid);

        const project = await getProjectById(uid);

        setProjectUsers(project.users || []);
        setProjectName(project.name);

        const projectFiles = filterFilesByProject(data, uid);
        const file = filterFilesByFID(projectFiles, fid);

        const lang = determineFileType(file.filename) || "plaintext";

        setCurrentFilename(file.filename);

        setFiletype(lang);

        setFileContent(file.content || "");
      } catch (error) {
        console.error(error);

        setConnectionStatus("disconnected");
      }
    };

    getFileData();
  }, [uid, fid, refreshTrigger]);

  useEffect(() => {
    const getUserDisplayName = async () => {
      const data = await getProfile();
      if (!data || data.length < 1) {
        displayName.current = getCurrentUserEmail();
      } else {
        const artefact = JSON.parse(data[0].artefact);
        displayName.current = artefact.displayName;
      }
    };

    getUserDisplayName();
  }, []);

  useEffect(() => {
    const handleOffline = () => {
      setConnectionStatus("disconnected");
    };

    const handleOnline = () => {
      setConnectionStatus("connected");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const updateCursorStyles = () => {
    const states = awarenessRef.current.getStates();
    let cursorStyles = "";

    for (const [clientId, state] of states) {
      const user = state.user.name;
      const color = state.user.color;

      // create styles for each user in the format that Yjs automatically creates
      cursorStyles += `
          .yRemoteSelection-${clientId},
          .yRemoteSelectionHead-${clientId} {
            --user-color: ${color};
          }

          .yRemoteSelection-${clientId} {
            background-color: ${color}33;
          }

          .yRemoteSelectionHead-${clientId} {
            border-left: 2px solid ${color};
          }

          .yRemoteSelectionHead-${clientId}::after {
            content: '${user}';
            background-color: ${color};
            color: white;
            position: absolute;
            top: -1.4em;
            left: 0;
            font-size: 10px;
            padding: 0 4px;
            border-radius: 2px;
            white-space: nowrap;
            z-index: 20;
          }
        `;
    }

    let styleTag = document.getElementById("cursor-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "cursor-styles";
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = cursorStyles;
  };

  useEffect(() => {
    GSocketInstance.emit("open file", fid);

    // adds received content to the editor at the specified range
    const handleContent = (updateEvent) => {
      // we do not want to capture normal selection events for this and we don't want to execute our own emitted events
      if (!updateEvent.data?.type || updateEvent.data?.sender === getCurrentUserEmail()) return;

      switch (updateEvent.data?.type) {
        // content updates
        case "isYjs":
          // if a user has already created a doc, share it instead of other users opening a new one
          if (updateEvent.data?.isDocRequest) {
            const state = Y.encodeStateAsUpdate(ydoc.current);
            const stateAsString = state.toBase64();
            GSocketInstance.emit("selection", {
              uid: fid,
              data: {
                sender: getCurrentUserEmail(),
                update: stateAsString,
                type: "isYjs",
              },
            });
          } else if (!updateEvent.data?.isDocRequest) {
            const updatedContent = Uint8Array.fromBase64(updateEvent.data.update);
            Y.applyUpdate(ydoc.current, updatedContent, getCurrentUserEmail());
          }
          break;
        // cursor updates
        case "isAwarenessUpdate":
          if (!awarenessRef.current || !monacoBinding.current) break;
          // eslint-disable-next-line no-case-declarations
          const update = Uint8Array.fromBase64(updateEvent.data.update);
          applyAwarenessUpdate(awarenessRef.current, update, updateEvent.data.sender);
          // iterate over all users and ensure none have the color #FF0000 (the placeholder color, as it cannot be an actual user color)
          awarenessRef.current.getStates().forEach((state) => {
            if (state.user.color === "#FF0000") {
              awarenessRef.current.setLocalStateField("user", {
                name: displayName.current,
                color: hslToHex(
                  usernameToHSL(
                    getCurrentUserEmail(),
                    Object.values(activeUsers)
                      .map((u) => (typeof u === "object" ? u.color : u))
                      .filter(Boolean),
                  ),
                ),
              });
            }
          });
          updateCursorStyles();
          break;
        default:
          break;
      }
    };

    const handleUsers = (users) => {
      // Added this to make activeuserlist smoother. Listens to a user-event and updates the userlist
      const usersAsObjects = users.map((email) => {
        // ActiveUserList expects an array of objects with an email property, but the backend sends an array of strings
        return { email: email };
      });
      setProjectUsers(usersAsObjects);
    };

    GSocketInstance.on("selection", handleContent);
    GSocketInstance.on("users", handleUsers);
    GSocketInstance.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    GSocketInstance.on("connect", () => {
      setConnectionStatus("connected");
    });

    return () => {
      GSocketInstance.off("selection", handleContent);
      GSocketInstance.off("users", handleUsers);
      GSocketInstance.off("disconnect");
      GSocketInstance.off("connect");
      GSocketInstance.emit("close file", fid);

      if (awarenessRef.current) {
        awarenessRef.current.setLocalState(null);
      }

      if (monacoBinding.current) {
        monacoBinding.current.destroy();
      }

      GSocketInstance.emit("users");

      GSocketInstance.off("users", handleUsers);

      ydoc.current?.destroy();
    };
    // including activeUsers in the dep array creates an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fid]);

  const handleEditorDidMount = async (editor) => {
    editorRef.current = editor;
    const yjs = new Y.Doc();
    ydoc.current = yjs;

    const ytext = yjs.getText("monaco");

    const awareness = new Awareness(yjs);
    awarenessRef.current = awareness;

    awareness.setLocalStateField("user", {
      name: displayName.current,
      color: "#FF0000", // placeholder
    });

    // bind the editor and the model to our Yjs document so that Yjs can access its text
    const binding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), awareness);

    monacoBinding.current = binding;

    /**
     * the update event is emitted when Yjs detects (through the binding) that the editor content has been updated
     * @param {Uint8Array} update a blob that describes the updated content
     */
    yjs.on("update", (update, origin) => {
      // disallow updates we send ourselves (as it was our update that triggered the event)
      if (origin === getCurrentUserEmail()) return;
      const updateAsString = update.toBase64();

      /*
      / we use the selection event as a bit of a cheat code to broadcast changes as its data is non-persistent and can
      / be any string we like
      */
      GSocketInstance.emit("selection", {
        uid: fid,
        data: {
          type: "isYjs", // so that we can allow for actual selection events
          update: updateAsString,
          sender: getCurrentUserEmail(),
        },
      });
    });

    awareness.on("change", ({ added, updated, removed }) => {
      // encode the changes as a socket-friendly string
      const changes = encodeAwarenessUpdate(awarenessRef.current, [
        ...added,
        ...updated,
        ...removed,
      ]).toBase64();

      GSocketInstance.emit("selection", {
        uid: fid,
        data: {
          type: "isAwarenessUpdate",
          update: changes,
          sender: getCurrentUserEmail(),
        },
      });
    });

    awareness.on("change", updateCursorStyles);

    /*
     there can only be one Ydoc update chain, else the communication chain breaks. for this reason, only the first user to open a file creates the Ydoc,
     and then shares it with users who join after. we wait 300ms for a Ydoc to be shared with us, and if it isn't,
     we assume we are the first user and create it ourselves
    */
    GSocketInstance.emit("selection", {
      uid: fid,
      data: {
        sender: getCurrentUserEmail(),
        type: "isYjs",
        isDocRequest: true,
      },
    });

    setTimeout(() => {
      if (ydoc.current.getText("monaco").length === 0) {
        ydoc.current.getText("monaco").insert(0, fileContent);
      }
    }, 300);
  };

  useEffect(() => {
    if (!awarenessRef.current) return;

    const userColor = hslToHex(activeUsers[getCurrentUserEmail()]?.color);

    awarenessRef.current.setLocalStateField("user", {
      name: displayName.current,
      color: userColor,
    });
  }, [activeUsers]);

  const handleEditorChange = (value) => {
    const updatedContent = value || "";

    setSaveStatus("saving");

    GSocketInstance.emit("content", {
      content: editorRef.current?.getValue(),
      uid: fid,
    });

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setSaveStatus("saved");
    }, 500);
  };

  if (!fileContent && !fileType) {
    return <div>{connectionStatus === "disconnected" ? "Connection lost" : "Loading..."}</div>;
  }

  const breadcrumbItems = [
    {
      label: "Dashboard",
      path: "/",
    },

    {
      label: projectName,
      path: `/projects/${uid}`,
    },

    {
      label: currentFilename,
    },
  ];

  return (
    <div>
      <style>
        {Object.keys(activeUsers)
          .map((username) => {
            const color = getUserColor(activeUsers, username);
            const usernameWithoutSpecials = username.replace(/[^a-zA-Z0-9]/g, "-");
            return `.remote-selection-${usernameWithoutSpecials} { background-color: ${color}; opacity: 0.4; }`;
          })
          .join("\n")}
      </style>

      <div className="px-4 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex pt-0 p-2 gap-6 h-[80vh]">
        <div
          className="
            w-52
            shrink-0
            flex
            flex-col
            gap-3
          "
        >
          <div
            className="
              text-sm
              text-center
              text-gray-400
              min-h-6
            "
          >
            {saveStatus === "saving" && "Saving..."}

            {saveStatus === "saved" && "✓ Saved"}

            {saveStatus === "error" && "Failed to save"}

            {connectionStatus === "disconnected" && (
              <div
                className="
                  text-red-500
                  font-bold
                "
              >
                Connection lost
              </div>
            )}
          </div>

          <button
            className="
              button
              button-cyan
              w-full
            "
            onClick={() => editorRef.current?.getAction("actions.find").run()}
          >
            Search
          </button>

          <button
            className="
              button
              button-cyan
              w-full
            "
            onClick={() =>
              editorRef.current?.getAction("editor.action.startFindReplaceAction").run()
            }
          >
            Replace
          </button>
          <div
            className="
              w-full
              border
              border-[var(--border-color)]
              rounded-xl
              p-4
              bg-gray-900/40
              overflow-y-auto
              overflow-x-hidden
            "
          >
            <EditorFileList
              showCreateFile={showCreateFile}
              refreshTrigger={refreshTrigger}
              onAddFile={() => setShowCreateFile(!showCreateFile)}
              onFileCreated={() => {
                setRefreshTrigger((n) => n + 1);
                setShowCreateFile(false);
              }}
            />
          </div>
          <ActiveUserList
            filename={currentFilename}
            projectUsers={projectUsers}
          />
        </div>

        <div
          className="
            flex-1
            min-w-0
            max-w-[calc(100vw-320px)]
            border
            rounded-xl
            border-cyan-500
            overflow-hidden
          "
        >
          <Editor
            height="100%"
            theme="vs-dark"
            language={fileType}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
    </div>
  );
}
