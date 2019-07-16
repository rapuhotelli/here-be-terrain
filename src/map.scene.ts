import { Grid } from './grid';

const effectsMap = new Grid(10, 15);

export default class MapScene extends Phaser.Scene {
  preload() { }
  create() {
    effectsMap.addToScene(this, 1024/2, 768/2, 32);
  }
}
