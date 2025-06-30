import './Garden.css';
import { createContext, useContext, createRef, useState, type ReactNode } from 'react';
import Mower from './Mower';
import Lawn from './Lawn';
import Programmer, { type LawnDef, type MowerDef } from './Programmer';
import { type MowerHandle } from './Mower';
import { type Position } from './Types';

export default function Garden() {
  return (
    <GardenProvider>
      <div className="garden">
        <div className="garden-left">
          <GardenProgrammer />
          <GardenMowers />
        </div>
        <div className="garden-right">
          <GardenLawn />
        </div>
      </div>
    </GardenProvider>
  );
}

const GardenContext = createContext<any>(null);

function GardenProvider({ children }: { children: ReactNode }) {
  const [lawnDef, setLawnDef] = useState<LawnDef | null>(null);
  const [mowerPosition, setMowerPosition] = useState<Position | null>(null);
  const [mowersDef, setMowersDef] = useState<MowerDef[]>([]);
  const [mowersRef, setMowersRef] = useState<React.RefObject<MowerHandle | null>[]>([]);

  const handleLawnDefined = (lawn: LawnDef) => setLawnDef(lawn);
  const handleMowersDefined = (mowers: MowerDef[]) => {
    setMowersDef(mowers);
    setMowersRef(mowers.map(() => createRef<MowerHandle | null>()));
  };
  const handleStart = async (mowerId: number) => {
    const mower = mowersRef[mowerId]?.current;
    if (mower) await mower.run();
  };
  const handlePositionChange = (pos: Position) => setMowerPosition(pos);

  return (
    <GardenContext.Provider value={{
      lawnDef, mowerPosition, mowersDef, mowersRef,
      handleLawnDefined, handleMowersDefined, handleStart, handlePositionChange
    }}>
      {children}
    </GardenContext.Provider>
  );
}

function GardenProgrammer() {
  const ctx = useContext(GardenContext);
  return (
    <Programmer
      onLawnDefined={ctx.handleLawnDefined}
      onMowersDefined={ctx.handleMowersDefined}
      onMowerStart={ctx.handleStart}
    />
  );
}

function GardenMowers() {
  const ctx = useContext(GardenContext);
  if (!ctx.lawnDef || !ctx.mowersDef.length) return null;
  return (
    <div className="mowers-container">
      {ctx.mowersDef.map((mower: MowerDef) => (
        <Mower
          name={`Tondeuse ${mower.id + 1}`}
          ref={ctx.mowersRef[mower.id]}
          key={mower.id}
          position={mower.position}
          program={mower.program}
          onPositionChange={ctx.handlePositionChange}
          lawnSize={ctx.lawnDef.size}
        />
      ))}
    </div>
  );
}

function GardenLawn() {
  const ctx = useContext(GardenContext);
  if (!ctx.lawnDef) return null;
  return <Lawn size={ctx.lawnDef.size} mowerPosition={ctx.mowerPosition} />;
}
