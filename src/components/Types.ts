export type MowerOrientation = 'N' | 'E' | 'W' | 'S';
export type MowerOrder = 'R' | 'L' | 'F';

export type Coordinates = {
  x: number;
  y: number;
};

export type Position = Coordinates & {
  orientation: MowerOrientation;
};
