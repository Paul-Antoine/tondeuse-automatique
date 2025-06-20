import './Lawn.css';

import { type ReactNode } from 'react';
interface LawnProps {
  size: {x: number, y: number};
  children?: ReactNode;
}

export default function Lawn({ size: width, children } : LawnProps) {

  return (
    <div className='lawn'>
      <h3>Pelouse {width.x} x {width.y}</h3>
      {children}
    </div>
  );
};
