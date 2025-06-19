import './Mower.css';
import { useImperativeHandle, forwardRef, useState } from 'react';
import type { MowerOrientation, MowerOrder, Coordinates, Position } from './Types';

interface MowerProps {
  name: string;
  x: number;
  y: number;
  lawnSize: { x: number; y: number };
  orientation: MowerOrientation;
  program?: string;
  speed?: number;
}

export interface MowerHandle {
  run: () => Promise<void>;
  move: (direction: MowerOrder) => void;
}

const Mower = forwardRef<MowerHandle, MowerProps>(({name, x, y, lawnSize, orientation, program, speed}, ref) => {
  const lawnLimit: Coordinates = lawnSize;
  const [position, setPosition] = useState<Position>({ x, y, orientation });
  const [isRunning, setIsRunning] = useState(false);

  const move = (direction: MowerOrder) => {
    setPosition((prev) => {
      let { x, y, orientation } = prev;

      if (direction == 'F') {
        return { ...moveForward(prev, lawnLimit), orientation };
      }

      if (direction == 'R' || direction == 'L') {
        return { x, y, orientation: rotate(orientation, direction) };
      }

      return prev;
    });
  };

  const run = () => {
    return new Promise<void>((resolve) => {
      if (program && !isRunning) {
        if(program.length == 1) {
          move(program.charAt(0) as MowerOrder);
          resolve();
          return;
        }
        
        setIsRunning(true);
        let currentIndex = 0;
        let interval = setInterval(() => {
          const order: MowerOrder | undefined = program.charAt(currentIndex) as MowerOrder;
          if (order) {
            move(order);
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsRunning(false);
            resolve();
          }
        }, 500);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    run,
    move,
  }));

  return (
    <div className="mower">
      <span className='mower-name'>{name}</span>
      <span>Position: {position.x}, {position.y}, {position.orientation}</span>
      {program && (
        <button 
          onClick={run} 
          disabled={isRunning} 
          title={`program: ${program}`}
          style={{ background: isRunning ? '#ffdada' : '' }}
        >
          Start
        </button>
      )}
    </div>
  );
});

function moveForward(pos : Position, lawnLimit: Coordinates): Coordinates {
  // Check if the mower is at the edge of the lawn
  if ((pos.orientation == 'N' && pos.y + 1 > lawnLimit.y)
    || (pos.orientation == 'E' && pos.x + 1 > lawnLimit.x)
    || (pos.orientation == 'W' && pos.x - 1 < 0)
    || (pos.orientation == 'S' && pos.y - 1 < 0)) return pos;

  switch (pos.orientation) {
    case 'N':
      return { x: pos.x, y: pos.y + 1 };
    case 'E':
      return { x: pos.x + 1, y: pos.y };
    case 'W':
      return { x: pos.x - 1, y: pos.y };
    case 'S':
      return { x: pos.x, y: pos.y - 1 };
  }
}

function rotate(orientation: MowerOrientation, order: MowerOrder): MowerOrientation {
  const orientations: MowerOrientation[] = ['N', 'E', 'S', 'W'];
  const currentIndex = orientations.indexOf(orientation);

  switch (order) {
    case 'R':
      return orientations[(currentIndex + 1) % orientations.length];
    case 'L':
      return orientations[(currentIndex - 1 + orientations.length) % orientations.length];
    case 'F':
      return orientation;
  }
};

export default Mower;
