export interface IEncounter {
  key: string;
  name: string;
  grid: {
    cellSize: number;
    offsetX: number;
    offsetY: number
  } | false;
  shaders: IEncounterShader[];
  layers: IEncounterLayer[];
}

export interface IEncounterShader {
  key: string;
  shader: string;
}

export interface IEncounterLayer {
  key: string;
  type: 'texture' | 'shader';
  texture?: string;
  shader?: string;
  active: boolean;
  position?: {x: number, y: number};
  dimensions?: {width: number, height: number};
  customUniforms?: { type: string, value: any };
}

export interface IPlayerGroup {
  name: string;
  players: string[];
}
