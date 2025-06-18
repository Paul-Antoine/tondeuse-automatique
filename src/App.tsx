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

      {lawn && mowers.length > 0 && (
        <div>
          <div>
            {mowers.map((mower) => (
              <Mower ref={mower.ref} key={mower.id}
                x={mower.x} y={mower.y} orientation={mower.orientation as MowerOrientation}
                program={mower.program} maxX={lawn.widthX} maxY={lawn.widthY}
              />
            ))}
          </div>
          <div style={{ margin: '10px', padding: '10px', border: '2px solid ', backgroundColor: 'lightgreen' }}>
            <h3>Lawn size: {lawn.widthX} x {lawn.widthY}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
