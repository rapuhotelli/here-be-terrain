import { IEncounter } from './EncounterManager';
import { Grid } from './grid';
import { DEFAULT_CELL_SIZE } from './params';


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
  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    const cellSize = DEFAULT_CELL_SIZE;

    const columns = Math.ceil(screenWidth / cellSize);
    const rows = Math.ceil(screenHeight / cellSize);

    this.effectsMap = new Grid(rows, columns);
    this.effectsMap.addToScene(this, screenWidth/2, screenHeight/2, cellSize);
  }
}
