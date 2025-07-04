import './Programmer.css';
import { useState, type ChangeEvent } from 'react';
import type { MowerOrientation, Position } from './Types';

export interface LawnDef {
  size: { x: number; y: number };
}

export interface MowerDef {
  id: number;
  position: Position;
  program: string;
}

interface ProgrammerProps {
  onLawnDefined: (lawn: LawnDef) => void;
  onMowersDefined: (mowers: MowerDef[]) => void;
  onMowerStart: (mowerId: number) => Promise<void>;
}

export default function Programmer({ onLawnDefined: onLawnDefined, onMowersDefined: onMowersDefined, onMowerStart: onMowerStart }: ProgrammerProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mowersId, setMowersId] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if(!file) {
      return ;
    }

    setFileName(file.name);
    setError(null);

    const handleMowersDefined = (mowers: MowerDef[]) => {
      setMowersId(mowers.map(mower => mower.id));
      onMowersDefined(mowers);
    };
    programReader(file, onLawnDefined, handleMowersDefined, setError);
  };

  const handleStart = async () => {
    setIsRunning(true);

    for (let i = 0; i < mowersId.length; i++) {
      await onMowerStart(mowersId[i]);
    }

    setIsRunning(false);
  };

  return (
    <div className="programmer">
      <h3>Programmateur</h3>
      <div>
        <label htmlFor="file-upload-link" className='upload-link'>
          {fileName ? `${fileName}` : 'Charger un fichier'}
        </label>
        <input
          id="file-upload-link"
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {error && <p>Erreur : {error}</p>}
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleStart} disabled={isRunning}>Démarrer</button>
      </div>
    </div>
  );
}

async function programReader(
    file: File,
    onLawnDefined: (lawn: LawnDef) => void,
    onMowersDefined: (mowers: MowerDef[]) => void,
    onError: (error: string) => void) {
  try {
    const text = await file.text();

    const lines = text.split('\n').map(line => line.trim());
    if (!lines.length) throw new Error('Le fichier est vide ou invalide.');

    // first line = top right corner position (left bottom = 0, 0)
    const [posXStr, posYStr] = lines[0].split('');
    const posX = Number(posXStr);
    const posY = Number(posYStr);
    if (isNaN(posX) || isNaN(posY)) throw new Error('Dimensions de pelouse invalides.');

    onLawnDefined({ size: { x: posX + 1, y: posY + 1} }); // size = pos + 1

    const mowers: MowerDef[] = [];
    for (let i = 1; i < lines.length; i += 2) {
      const positionLine = lines[i];
      const programLine = lines[i + 1];
        if (!positionLine || !programLine) {
            throw new Error(`Ligne tondeuse invalide à la ligne ${i + 1}`);
        }

        const [xStr, yStr, orientation] = positionLine.split('').map(e => e.trim()).filter(e => !!e);
        const x = Number(xStr);
        const y = Number(yStr);
        if (isNaN(x) || isNaN(y) || !'NESW'.includes(orientation)) {
            throw new Error(`Ligne tondeuse invalide à la ligne ${i + 1}`);
        }

        const mowerId = mowers.length;
        mowers.push({ id: mowerId, position: { x, y, orientation: orientation as MowerOrientation }, program: programLine });
    }

    onMowersDefined(mowers);
  } catch (err: any) {
    onError(err.message);
  }
};
