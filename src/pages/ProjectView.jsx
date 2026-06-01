import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById } from "../services/projectService";
import { getFiles } from "../services/fileService";
import { filterFilesByProject } from "../models/file";
import { useSort } from "../hooks/useSort";
import CreateFileForm from "../components/CreateFileForm";
import FileList from "../components/FileList";
import ShareProjectForm from "../components/ShareProjectForm";
import SortDropdown from "../components/SortDropdown";
import LeaveProjectButton from "../components/LeaveProjectButton";
import Breadcrumbs from "../components/Breadcrumbs";

function ProjectView() {
  const { uid } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sortKey, setSortKey] = useState(null);

  const sortedFiles = useSort(files, sortKey);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(uid);
        setProject(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProject();
  }, [uid]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFiles(uid);
        const ownedFiles = filterFilesByProject(data, uid);
        setFiles(ownedFiles);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFiles();
  }, [uid, refreshTrigger]);

  const breadcrumbItems = [
    {
      label: "Dashboard",
      path: "/",
    },
    {
      label: project?.name || "Project",
    },
  ];

  if (error) return <p>{error}</p>;
  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <div className="px-4 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div
          className="
        flex
        flex-col
        lg:flex-row
        gap-6
      "
        >
          {/* Huvud - fillista */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm tracking-widest">PROJECT</p>

                <h1 className="text text-2xl font-bold">{project.name}</h1>
              </div>

              <SortDropdown onSelect={setSortKey} />
            </div>

            <FileList
              files={sortedFiles}
              setFiles={setFiles}
            />
          </div>

          {/* Höger kolumn */}
          <div className="w-full lg:w-72">
            <div
              className="
              grid
              grid-cols-3
              gap-3

              lg:flex
              lg:flex-col
              lg:gap-6
            "
            >
              <div className="w-full">
                <CreateFileForm
                  files={files}
                  onFileCreated={() => setRefreshTrigger((n) => n + 1)}
                />
              </div>

              <div className="w-full">
                <ShareProjectForm />
              </div>

              <div
                className="
                w-full
                flex
                items-end
                h-full
                pt-7
              "
              >
                <LeaveProjectButton uid={uid} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectView;
