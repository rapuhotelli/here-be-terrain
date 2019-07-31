import { GameObject } from '../../types/custom';

export class Cell implements GameObject {
  row: number;
  column: number;
  rect: Phaser.GameObjects.Rectangle;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  addToScene(scene: Phaser.Scene, x: number, y: number, size: number) : void {
    const fillAlpha = (this.row + this.column) % 2 ? 0.2 : 0;
    this.rect = scene.add.rectangle(x, y, size, size, 0xFFFFFF, fillAlpha);
  }
}