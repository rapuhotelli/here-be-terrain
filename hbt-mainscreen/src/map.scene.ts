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

  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    const cellSize = this.encounter.cellSize || DEFAULT_CELL_SIZE;

    const columns = Math.ceil(screenWidth / cellSize);
    const rows = Math.ceil(screenHeight / cellSize);

    this.encounter.layers.map((layer, order) => {
      if (layer.type === 'image') {
        this.add.image(DEFAULT_RESOLUTION_X/2, DEFAULT_RESOLUTION_Y/2, layer.key);
      } else if (layer.type === 'shader') {
        const position = layer.position
          ? {x: DEFAULT_RESOLUTION_X/2 + layer.position.x, y: DEFAULT_RESOLUTION_Y/2 + layer.position.y}
          : {x: DEFAULT_RESOLUTION_X/2, y: DEFAULT_RESOLUTION_Y/2 };
        
        const dimensions = layer.dimensions || {width: DEFAULT_RESOLUTION_X, height: DEFAULT_RESOLUTION_Y};
        
        this.add.shader(layer.key, position.x, position.y, dimensions.width, dimensions.height);
      }
    });
    
    this.effectsMap = new Grid(rows, columns);
    this.effectsMap.addToScene(this, screenWidth/2, screenHeight/2, cellSize);
  }
  
}
