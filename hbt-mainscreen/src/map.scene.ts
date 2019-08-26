import { IEncounter, IEncounterLayer } from './EncounterManager';
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

  constructor(encounter: IEncounter) {
    super({
      key: 'MapScene',
    });
    this.encounter = encounter;
    this.pipelines = [];
    this.t = 0;
  }
  
  
  preload() {

  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    const cellSize = this.encounter.cellSize || DEFAULT_CELL_SIZE;

    const columns = Math.ceil(screenWidth / cellSize);
    const rows = Math.ceil(screenHeight / cellSize);
    
    if (this.encounter.shaders) {
      this.encounter.shaders.map(shader => {
        const pipe = createTextureTintPipeline(this.game, this.cache.text.get(shader.key), shader.key);
        this.pipelines.push(pipe);
        this.cameras.main.setRenderToTexture(pipe);
      });
    }
    
    this.encounter.layers.map((layer, order) => {
      console.log(this.cache.json.get('encounter'));
      if (layer.type === 'texture') {
        const { position, dimensions } = setLayerDimensions(layer);
        if (layer.shader) {
          const shader = this.add.shader(layer.shader, position.x, position.y, dimensions.width, dimensions.height);
          shader.setChannel0(layer.key);
        } else {
          const textureLayer = this.add.image(position.x, position.y, layer.key);
          textureLayer.setDisplaySize(dimensions.width, dimensions.height);
        }
      } else if (layer.type === 'shader') {
        const { position, dimensions } = setLayerDimensions(layer);
        this.add.shader(layer.key, position.x, position.y, dimensions.width, dimensions.height);
      }
    });
    
    this.effectsMap = new Grid(rows, columns);
    this.effectsMap.addToScene(this, screenWidth/2, screenHeight/2, cellSize);
  }
  
  update(time: number) {
    this.t += 0.05;
    this.pipelines.map(pipeline => pipeline.setFloat1('time', time * 0.0005));
  }
  
}
