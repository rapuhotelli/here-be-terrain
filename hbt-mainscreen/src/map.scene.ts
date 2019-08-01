import { IEncounter, IEncounterLayer } from './EncounterManager';
import { Grid } from './grid';
import { DEFAULT_CELL_SIZE, DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y } from './params';


export default class MapScene extends Phaser.Scene {

  effectsMap: Grid;
  encounter: IEncounter;

  constructor(encounter: IEncounter) {
    super({
      key: 'MapScene',
    });
    this.encounter = encounter;
  }
  
  
  preload() {
    this.encounter.layers.map((layer: IEncounterLayer, order) => {
      if (layer.type === 'image') {
        this.load.image(layer.key, layer.resource);
      } else if (layer.type === 'shader') {
        this.load.glsl(layer.key, layer.resource);
      }
    });
  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    const cellSize = DEFAULT_CELL_SIZE;

    const columns = Math.ceil(screenWidth / cellSize);
    const rows = Math.ceil(screenHeight / cellSize);

    this.encounter.layers.map((layer, order) => {
      if (layer.type === 'image') {
        this.add.image(DEFAULT_RESOLUTION_X/2, DEFAULT_RESOLUTION_Y/2, layer.key);
      } else if (layer.type === 'shader') {
        const position = layer.position
          ? {x: screenWidth/2 + layer.position.x, y: screenHeight/2 + layer.position.y}
          : {x: screenWidth/2, y: screenHeight/2 };
        
        const dimensions = layer.dimensions || {width: screenWidth, height: screenHeight};
        this.add.shader(layer.key, position.x, position.y, dimensions.width, dimensions.height);
      }
    });
    
    this.effectsMap = new Grid(rows, columns);
    this.effectsMap.addToScene(this, screenWidth/2, screenHeight/2, cellSize);
  }
  
}
