export interface IEncounter {
  key: string;
  name: string;
  cellSize?: number;
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