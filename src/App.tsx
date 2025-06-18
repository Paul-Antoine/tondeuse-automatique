import './App.css';
import Mower from './components/Mower';
import type { MowerOrientation } from './components/Types';
import Programmer, { type LawnDef, type MowerDef } from './components/Programmer';
import { useState } from 'react';

function App() {
  const [lawn, setLawn] = useState<LawnDef | null>(null);
  const [mowers, setMowers] = useState<MowerDef[]>([]);

  return (
    <div className="App">
      <Programmer 
        onLawnDefined={(lawn) => setLawn(lawn)}
        onMowersDefined={(mowers) => setMowers(mowers)}
      />
      {lawn && (
        <div>
          <h2>Lawn size: {lawn.widthX} x {lawn.widthY}</h2>
          {mowers.map((mower) => (
            <Mower 
              key={mower.id}
              x={mower.x}
              y={mower.y}
              orientation={mower.orientation as MowerOrientation}
              program={mower.program}
              maxX={lawn.widthX}
              maxY={lawn.widthY}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
