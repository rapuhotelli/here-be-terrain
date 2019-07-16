import { GameObject } from '../types/custom';

export class Cell implements GameObject {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  addToScene(scene: Phaser.Scene, x: number, y: number, size: number) : void {
    const fillAlpha = (this.row + this.column) % 2 ? 0.2 : 0;
    scene.add.rectangle(x, y, size, size, 0xFFFFFF, fillAlpha);
  }
}