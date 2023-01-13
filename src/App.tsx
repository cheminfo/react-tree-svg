import { MoleculesGraph } from "./MoleculesGraph";

import { getData } from "./data/data";

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
