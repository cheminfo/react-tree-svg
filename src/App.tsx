import { MoleculesGraph } from "./components/MoleculesGraph";

import { getData } from "./data/reaction";

function App() {
  return (
    <div>
      <div>
        <MoleculesGraph data={getData()} />
      </div>
    </div>
  );
}

export default App;
