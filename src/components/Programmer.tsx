import { useState, type ChangeEvent } from 'react';

export interface LawnDef {
  widthX: number;
  widthY: number;
}

export interface MowerDef {
  id: number;
  x: number;
  y: number;
  orientation: string;
  program: string;
}

interface ProgrammerProps {
  onLawnDefined: (lawn: LawnDef) => void;
  onMowersDefined: (mowers: MowerDef[]) => void;
}

export default function Programmer({ onLawnDefined: onLawnDefined, onMowersDefined: onMowersDefined }: ProgrammerProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

        onLawnDefined({ widthX: widthX, widthY: widthY });

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
            mowers.push({ id: mowers.length, x, y, orientation: dir, program: programLine });
        }

        onMowersDefined(mowers);
      } catch (err: any) {
        setError(err.message);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div>
      <label>
        Fichier de configuration :
        <input type="file" accept=".txt" onChange={handleFileUpload} className="mt-2" />
      </label>
      {error && <p>Erreur : {error}</p>}
    </div>
  );
}
