import { SVGBoxesTree } from "./components/SVGBoxesTree";

import { getData } from "./data/reaction";

function App() {
  return (
    <div
      style={{
        border: "1px solid red",
        overflow: "clip",
      }}
    >
      <SVGBoxesTree data={getData()} />
    </div>
  );
}

export default App;
