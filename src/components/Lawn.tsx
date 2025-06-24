import './Lawn.css';

import { useEffect, useState, type ReactNode } from 'react';
import type { Position } from './Types';
interface LawnProps {
  size: {x: number, y: number};
  mowerPosition: Position | null; // display the position of the mower, manage only 1 mower here
}

export default function Lawn({ size, mowerPosition } : LawnProps) {
  const [lawnSquares, setLawnSquares] = useState<ReactNode[]>([]);
  useEffect(() => {
    const lawnSquares = Array.from({ length: size.x * size.y }).map((_, i) => {
      const isMowerPosition = i % size.x == mowerPosition?.x && Math.floor(i / size.x) == mowerPosition?.y;
      return <LawnSquare key={i} name={isMowerPosition ? mowerPosition.orientation : ''} />
    });

    setLawnSquares(lawnSquares);
  }, [size, mowerPosition]);

  return (
    <div className='lawn'>
      <h3>Pelouse {size.x} x {size.y}</h3>
      <div className='lawn-grid'
        style={{
          '--lawn-cols': size.x,
          '--lawn-rows': size.y
        } as React.CSSProperties}
      >
        {lawnSquares}
      </div>
    </div>
  );
};

function LawnSquare({name} : {name: string}) {
  return <div className='lawn-square'>{name}</div>;
}