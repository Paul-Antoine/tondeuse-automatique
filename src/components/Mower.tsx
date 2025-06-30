import './Mower.css';
import { useImperativeHandle, forwardRef, useState } from 'react';
import type { MowerOrientation, MowerOrder, Coordinates, Position } from './Types';

interface MowerProps {
  name: string;
  position: Position;
  lawnSize: { x: number; y: number };
  program?: string;
  onPositionChange?: (pos: Position) => void;
}

export interface MowerHandle {
  run: () => Promise<void>;
  move: (direction: MowerOrder) => void;
}

const Mower = forwardRef<MowerHandle, MowerProps>(({name, position: initialPosition, lawnSize, program, onPositionChange}, ref) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isRunning, setIsRunning] = useState(false);

  const move = (direction: MowerOrder) => {
    setPosition((prev) => {
      let { x, y, orientation } = prev;

      if (direction == 'F') {
        const newPos = { ...moveForward(prev, lawnSize), orientation };
        onPositionChange && onPositionChange(newPos);
        return newPos;
      }

      if (direction == 'R' || direction == 'L') {
        const newPos = { x, y, orientation: rotate(orientation, direction) };
        onPositionChange && onPositionChange(newPos);
        return newPos;
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

function moveForward(pos : Position, lawnSize: Coordinates): Coordinates {
  // Check if the mower is at the edge of the lawn
  if ((pos.orientation == 'N' && pos.y + 1 >= lawnSize.y)
    || (pos.orientation == 'E' && pos.x + 1 >= lawnSize.x)
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
