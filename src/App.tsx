import React from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const App = () => {
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
