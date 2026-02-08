import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useEffect, useState } from "react";
import setupMenu from "./menu/setup-menu";
import NewProject from "./components/NewProject";
import Modal from "./components/Modal";

const App = () => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  useEffect(() => {
    setupMenu({
      newProjectAction: () => {
        setIsNewProjectOpen(true);
      }
    });
  }, []);

  return (
    <main className="h-screen w-screen">
      <Allotment>
        <div>ComponentA</div>
        <div>ComponentB</div>
      </Allotment>

      <Modal isOpen={isNewProjectOpen} onClose={() => setIsNewProjectOpen(false)}>
        <NewProject />
      </Modal>
    </main>
  );
}

export default App;
