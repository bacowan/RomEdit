import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useEffect } from "react";
import setupMenu from "./menu/setup-menu";

const App = () => {
  useEffect(() => {
    setupMenu();
  }, []);

  return (
    <main className="h-screen w-screen">
      <Allotment>
        <div>ComponentA</div>
        <div>ComponentB</div>
      </Allotment>
    </main>
  );
}

export default App;
