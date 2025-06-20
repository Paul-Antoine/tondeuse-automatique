import './Garden.css';
import { createRef, useState } from 'react';
import Mower from './Mower';
import Lawn from './Lawn';
import Programmer, { type LawnDef, type MowerDef } from './Programmer';
import { type MowerHandle } from './Mower';

export default function Garden() {
  const [lawnDef, setLawnDef] = useState<LawnDef | null>(null);
  const [mowersDef, setMowersDef] = useState<MowerDef[]>([]);
  const [mowersRef, setMowersRef] = useState<React.RefObject<MowerHandle | null>[]>([]);

  const handleLawnDefined = (lawn: LawnDef) => {
    setLawnDef(lawn);
  };

  const handleMowersDefined = (mowers: MowerDef[]) => {
    setMowersDef(mowers);
    setMowersRef(mowers.map(() => createRef<MowerHandle | null>()));
  };

  const handleStart = async (mowerId: number) => {
    const mower = mowersRef[mowerId]?.current;
    if (mower) {
      await mower.run();
    }
  };

  return (
    <div className="garden">
      <Programmer 
        onLawnDefined={handleLawnDefined}
        onMowersDefined={handleMowersDefined}
        onMowerStart={handleStart}
      />

      {lawnDef && mowersDef.length && (
        <div className='mowers-container'>
          {mowersDef.map((mower) => (
            <Mower 
              name={`Tondeuse ${mower.id + 1}`}
              ref={mowersRef[mower.id]} 
              key={mower.id}
              position={mower.position}
              program={mower.program} 
              lawnSize={lawnDef.size}
            />
          ))}
        </div>
      )}

      {lawnDef && (<Lawn size={lawnDef.size} />)}
    </div>
  );
}
