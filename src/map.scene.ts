import { Grid } from './grid';

const map = new Grid(10, 15);

export default class MapScene extends Phaser.Scene {
  preload() { }
  create() {
    const mapGrid = map.asGameObject(this, 1024/2, 768/2, 30);
    this.children.add(mapGrid);
  }
}
