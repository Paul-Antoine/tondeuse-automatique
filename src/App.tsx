import './App.css';
import Mower from './components/Mower';
import type { MowerOrientation } from './components/Types';
import Programmer, { type LawnDef, type MowerDef } from './components/Programmer';
import { useState } from 'react';
import Lawn from './components/Lawn';

function App() {
  const [lawn, setLawn] = useState<LawnDef | null>(null);
  const [mowers, setMowers] = useState<MowerDef[]>([]);

  return (
    <div className="App">
      <Programmer 
        onLawnDefined={(lawn) => setLawn(lawn)}
        onMowersDefined={(mowers) => setMowers(mowers)}
      />

      {lawn && mowers.length && (
        <div className='mowers-container'>
          {mowers.map((mower) => (
            <Mower 
              name={`Tondeuse ${mower.id + 1}`}
              ref={mower.ref} 
              key={mower.id}
              x={mower.x} 
              y={mower.y} 
              orientation={mower.orientation as MowerOrientation}
              program={mower.program} 
              lawnSize={lawn.size}
            />
          ))}
        </div>
      )}

      {lawn && (<Lawn width={lawn.size} />)}
    </div>
  );
}

export default App;
