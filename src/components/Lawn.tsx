import './Lawn.css';

interface LawnProps {
  size: {x: number, y: number};
}

export default function Lawn({ size: width } : LawnProps) {

  return (
    <div className='lawn'>
      <h3>Pelouse {width.x} x {width.y}</h3>
    </div>
  );
};
