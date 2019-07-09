import { GameObject } from '../types/custom';

export class Cell implements GameObject {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }

  asGameObject(scene: Phaser.Scene, x: number, y: number, size: number) : Phaser.GameObjects.Rectangle {
    const cell = new Phaser.GameObjects.Rectangle(scene, x, y, size, size);
    cell.setFillStyle(0x0, 0);
    cell.setStrokeStyle(1, 0xFFFFFF, 0.5);
    return cell;
  }
}