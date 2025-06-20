import './Garden.css';
import Mower from './Mower';
import Programmer, { type LawnDef, type MowerDef } from './Programmer';
import { useState } from 'react';
import Lawn from './Lawn';

export default function Garden() {
  const [lawn, setLawn] = useState<LawnDef | null>(null);
  const [mowers, setMowers] = useState<MowerDef[]>([]);

  return (
    <div className="garden">
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
              position={mower.position}
              program={mower.program} 
              lawnSize={lawn.size}
            />
          ))}
        </div>
      )}

      {lawn && (<Lawn size={lawn.size} />)}
    </div>
  );
}
