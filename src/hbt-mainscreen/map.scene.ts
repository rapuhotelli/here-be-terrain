import { IEncounter, IEncounterLayer } from '../../hbt-common/interfaces';

import { encounterResourceKey } from './EncounterManager';
import { Grid } from './grid';
import { DEFAULT_CELL_SIZE, DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y } from './params';
import { createTextureTintPipeline } from './pipelines';

const setLayerDimensions = (layer: IEncounterLayer) => {
  const position = layer.position
    ? {x: DEFAULT_RESOLUTION_X/2 + layer.position.x, y: DEFAULT_RESOLUTION_Y/2 + layer.position.y}
    : {x: DEFAULT_RESOLUTION_X/2, y: DEFAULT_RESOLUTION_Y/2 };

  const dimensions = layer.dimensions || {width: DEFAULT_RESOLUTION_X, height: DEFAULT_RESOLUTION_Y};

  return {
    position,
    dimensions,
  };
};

export default class MapScene extends Phaser.Scene {

  effectsMap: Grid;
  encounter: IEncounter;
  pipelines: Phaser.Renderer.WebGL.WebGLPipeline[];
  t: number;

  constructor(
    encounter: IEncounter,
    sceneConfig: string | Phaser.Types.Scenes.SettingsConfig = { key: 'MapScene' },
  ) {
    super(sceneConfig);
    this.encounter = encounter;
    this.pipelines = [];
    this.t = 0;
  }

  preload() {

  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;
    
    const encounterResource = encounterResourceKey(this.encounter);
    
    if (this.encounter.shaders) {
      this.encounter.shaders.map(shader => {
        const pipe = createTextureTintPipeline(this.game, this.cache.text.get(shader.key), shader.key);
        this.pipelines.push(pipe);
        this.cameras.main.setRenderToTexture(pipe);
      });
    }
    
    this.encounter.layers.map((layer, order) => {
      if (layer.type === 'texture') {
        const { position, dimensions } = setLayerDimensions(layer);
        if (layer.shader) {
          const shader = this.add.shader(encounterResource(layer.shader), position.x, position.y, dimensions.width, dimensions.height);
          shader.setChannel0(encounterResource(layer.key));
        } else {
          const textureLayer = this.add.image(position.x, position.y, encounterResource(layer.key));
          textureLayer.setDisplaySize(dimensions.width, dimensions.height);
        }
      } else if (layer.type === 'shader') {
        const { position, dimensions } = setLayerDimensions(layer);
        this.add.shader(encounterResource(layer.key), position.x, position.y, dimensions.width, dimensions.height);
      }
    });

    if (!this.encounter.grid) {
      return;
    }

    const cellSize = this.encounter.grid.cellSize || DEFAULT_CELL_SIZE;
    const columns = Math.ceil(screenWidth / cellSize);
    const rows = Math.ceil(screenHeight / cellSize);
    this.effectsMap = new Grid(rows, columns);
    this.effectsMap.addToScene(this, screenWidth/2, screenHeight/2, cellSize);
  }
  
  update(time: number) {
    this.t += 0.05;
    this.pipelines.map(pipeline => pipeline.setFloat1('time', time * 0.0005));
  }
  
}
