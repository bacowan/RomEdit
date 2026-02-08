import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

const NewProject = () => {
  const [projectFilePath, setProjectFilePath] = useState("");
  const [projectName, setProjectName] = useState("");
  const [romPath, setRomPath] = useState("");

  const onBrowseClick = async () => {
    setProjectFilePath(await invoke("open_file_dialog"));
  }

  const onCreateClick = () => {
  }

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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select project file location"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium cursor-pointer"
              onClick={onBrowseClick}
            >
              Browse
            </button>
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
          <input
            type="text"
            value={romPath}
            onChange={(e) => setRomPath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ROM path"
          />
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
