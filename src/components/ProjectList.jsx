import { useEffect, useState } from "react";
import { getProjectById, getProjects } from "../services/projectService";
import ProjectItem from "./ProjectItem";
import CreateProjectForm from "./CreateProjectForm";
import folderEmpty from "../assets/icons/folderEmpty.png";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        const details = await Promise.all(data.map((project) => getProjectById(project.uid)));

        details.sort((a, b) => a.name.localeCompare(b.name));

        setProjects(details);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [refreshTrigger]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <p
          className="
            text-gray-400
          "
        >
          Select a project or create a new one below
        </p>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <img
            src={folderEmpty}
            alt="Empty folder"
            className="
              w-16
              h-16
              mx-auto
              mb-4
              opacity-80
            "
          />

          <h2 className="text-xl font-semibold">No projects yet</h2>
        </div>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <ProjectItem
              key={project.uid}
              project={project}
            />
          ))}
        </ul>
      )}

      <div
        className="
          mt-16
          pt-10
          border-t
          border-[var(--border-color)]
          flex
          flex-col
          items-start
          gap-4
        "
      >
        <div className="text-left">
          <h1 className="text text-2xl font-bold">Create a new project</h1>
        </div>

        <CreateProjectForm onProjectCreated={() => setRefreshTrigger((n) => n + 1)} />
      </div>
    </div>
  );
}

export default ProjectList;
