import './Programmer.css';
import { createRef, useState, type ChangeEvent } from 'react';
import type { MowerHandle } from '../components/Mower';

export interface LawnDef {
  size: { x: number; y: number };
}

export interface MowerDef {
  id: number;
  x: number;
  y: number;
  orientation: string;
  program: string;
  ref: React.RefObject<MowerHandle | null>;
}

interface ProgrammerProps {
  onLawnDefined: (lawn: LawnDef) => void;
  onMowersDefined: (mowers: MowerDef[]) => void;
}

export default function Programmer({ onLawnDefined: onLawnDefined, onMowersDefined: onMowersDefined }: ProgrammerProps) {
  const [error, setError] = useState<string | null>(null);
  const [mowers, setMowers] = useState<MowerDef[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const lines = text.split('\n').map(line => line.trim());
        if (lines.length < 1) throw new Error('Le fichier est vide ou invalide.');

        const [widthXStr, widthYStr] = lines[0].split('');
        const widthX = Number(widthXStr);
        const widthY = Number(widthYStr);
        if (isNaN(widthX) || isNaN(widthY)) throw new Error('Dimensions de pelouse invalides.');

        onLawnDefined({ size: { x: widthX, y: widthY } });

        const mowers: MowerDef[] = [];
        for (let i = 1; i < lines.length; i += 2) {
          const positionLine = lines[i];
          const programLine = lines[i + 1];
            if (!positionLine || !programLine) {
                throw new Error(`Ligne tondeuse invalide à la ligne ${i + 1}`);
            }
            const [xStr, yStr, dir] = positionLine.split('').map(e => e.trim()).filter(e => !!e);
            const x = Number(xStr);
            const y = Number(yStr);
            if (isNaN(x) || isNaN(y) || !'NESW'.includes(dir)) {
                throw new Error(`Ligne tondeuse invalide à la ligne ${i + 1}`);
            }
            mowers.push({ ref: createRef<MowerHandle>(), id: mowers.length, x, y, orientation: dir, program: programLine });
        }

        setMowers(mowers);
        onMowersDefined(mowers);
      } catch (err: any) {
        setError(err.message);
      }
    };
    
    reader.readAsText(file);
  };

  const handleStart = async () => {
    setIsRunning(true);

    for (let i = 0; i < mowers.length; i++) {
      const mower = mowers[i].ref.current;
      if (mower) {
        await mower.run();
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="programmer">
      <h3>Programmation des tondeuses</h3>
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
