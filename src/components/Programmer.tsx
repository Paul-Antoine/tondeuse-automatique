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
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setError(null);
      const text = event.target?.result as string;
      try {
        const lines = text.split('\n').map(line => line.trim());
        if (!lines.length) throw new Error('Le fichier est vide ou invalide.');

        const [widthXStr, widthYStr] = lines[0].split('');
        const widthX = Number(widthXStr);
        const widthY = Number(widthYStr);
        if (isNaN(widthX) || isNaN(widthY)) throw new Error('Dimensions de pelouse invalides.');

        onLawnDefined({ size: { x: widthX, y: widthY } });

        const mowers: MowerDef[] = [];
        const mowersId: number[] = [];
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
            mowersId.push(mowerId);
            mowers.push({ id: mowerId, position: { x, y, orientation: orientation as MowerOrientation }, program: programLine });
        }

        setMowersId(mowersId);
        onMowersDefined(mowers);
      } catch (err: any) {
        setError(err.message);
      }
    };
    
    reader.readAsText(file);
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
