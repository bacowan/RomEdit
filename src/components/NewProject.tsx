import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { appLocalDataDir, join } from '@tauri-apps/api/path';
import { message } from '@tauri-apps/plugin-dialog';

interface NewProjectProps {
  closeNewProjectModal: () => void;
}

const NewProject = ({ closeNewProjectModal }: NewProjectProps) => {
  const [projectFilePath, setProjectFilePath] = useState("");
  const [projectName, setProjectName] = useState("");
  const [romPath, setRomPath] = useState("");
  const [useRecommendedPath, setUseRecommendedPath] = useState(true);

  const onBrowseProjectClick = async () => {
    const path = await invoke("open_file_dialog");
    if (path && typeof path === "string") {
      setProjectFilePath(path);
    }
  }

  const onBrowseRomClick = async () => {
    const path = await invoke("open_file_dialog");
    if (path && typeof path === "string") {
      setRomPath(path);
    }
  }

  const onCreateClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoke("create_new_project", {
        projectFilePath: projectFilePath,
        projectName: projectName,
        romPath: romPath,
      });
      closeNewProjectModal();
    }
    catch (error) {
      await message(error as string, { title: 'Project Creation Failed', kind: 'error' });
    }
  }

  useEffect(() => {
    if (useRecommendedPath) {
      (async () => {
        const saveDir = await join(await appLocalDataDir(), "projects");
        const savePath = await join(saveDir, `${projectName}.proj`);
        setProjectFilePath(savePath);
      })();
    }
  }, [useRecommendedPath, projectName]);

  const isFormValid = projectFilePath && projectName && romPath;

  return (
    <div className="p-8 w-[500px]">
      <h2 className="text-2xl font-bold mb-6">New Project</h2>
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Project File Path
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={projectFilePath}
              onChange={(e) => setProjectFilePath(e.target.value)}
              readOnly={useRecommendedPath}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select project file location"
            />
            <button
              type="button"
              disabled={useRecommendedPath}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={onBrowseProjectClick}
            >
              Browse
            </button>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="useRecommendedPath"
              checked={useRecommendedPath}
              onChange={(e) => setUseRecommendedPath(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="useRecommendedPath" className="text-sm text-gray-700">
              Use recommended path
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ROM Path
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={romPath}
              onChange={(e) => setRomPath(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select ROM file"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium cursor-pointer"
              onClick={onBrowseRomClick}
            >
              Browse
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          onClick={onCreateClick}
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default NewProject;
