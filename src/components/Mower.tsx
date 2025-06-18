import { useImperativeHandle, forwardRef, useState } from 'react';
import type { MowerOrientation, MowerOrder, Coordinates, Position } from './Types';

interface MowerProps {
  x: number;
  y: number;
  maxX: number;
  maxY: number;
  orientation: MowerOrientation;
  program?: string;
}

export interface MowerHandle {
  run: () => Promise<void>;
  move: (direction: MowerOrder) => void;
}

const Mower = forwardRef<MowerHandle, MowerProps>((props, ref) => {
  const lawnLimit: Coordinates = { x: props.maxX, y: props.maxY };
  const program = props.program;
  const [position, setPosition] = useState<Position>({ x: props.x, y: props.y, orientation: props.orientation });
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
    <div style={{ margin: '10px', padding: '10px', border: '1px solid green' }}>
      <div>Orientation: {position.orientation}</div>
      <div>Position: {position.x}, {position.y}</div>
      <div>
        <button onClick={() => move('L')}>L</button>
        <button onClick={() => move('F')}>F</button>
        <button onClick={() => move('R')}>R</button>
      </div>
      <div>
        {program && (<button onClick={run} disabled={isRunning}>Start</button>)}
      </div>
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
