import './Lawn.css';

interface LawnProps {
  width: {x: number, y: number};
}

export default function Lawn({ width } : LawnProps) {

  return (
    <div className='lawn'>
      <h3>Pelouse {width.x} x {width.y}</h3>
    </div>
  );
};
