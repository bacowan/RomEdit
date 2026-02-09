import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useEffect, useState } from "react";
import setupMenu from "./menu/setup-menu";
import NewProject from "./components/NewProject";
import Modal from "./components/Modal";
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

const App = () => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const closeNewProjectModal = () => {
    setIsNewProjectOpen(false);
  }

  useEffect(() => {
    setupMenu({
      newProjectAction: () => {
        setIsNewProjectOpen(true);
      }
    });
  }, []);

  useEffect(() => {
    listen<String>('project-loaded', (event) => {
      getCurrentWindow().setTitle(`Rom Edit - ${event.payload}`);
    });
  }, []);

  return (
    <main className="h-screen w-screen">
      <Allotment>
        <div>ComponentA</div>
        <div>ComponentB</div>
      </Allotment>

      <Modal isOpen={isNewProjectOpen} onClose={closeNewProjectModal}>
        <NewProject closeNewProjectModal={closeNewProjectModal}/>
      </Modal>
    </main>
  );
}

export default App;
