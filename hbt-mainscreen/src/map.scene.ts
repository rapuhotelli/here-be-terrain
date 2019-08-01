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
    this.encounter.layers.map((layer, order) => {
      this.load.image(`layer${order}`, 'encounters/testcampaign/jungle1/jungle1.png');
    });
    
    this.load.glsl('water', 'encounters/testcampaign/shaders/water.frag');
    this.load.glsl('fire', 'encounters/testcampaign/shaders/fireball.frag');
  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    const cellSize = DEFAULT_CELL_SIZE;

    const columns = Math.ceil(screenWidth / cellSize);
    const rows = Math.ceil(screenHeight / cellSize);

    this.encounter.layers.map((layer, order) => {
      this.add.image(DEFAULT_RESOLUTION_X/2, DEFAULT_RESOLUTION_Y/2, `layer${order}`);
    });
    
    this.effectsMap = new Grid(rows, columns);
    this.effectsMap.addToScene(this, screenWidth/2, screenHeight/2, cellSize);

    this.add.shader('fire', 0, 0, 800, 800);
    this.add.shader('water', 400, 300, 800, 800);
  }
}
