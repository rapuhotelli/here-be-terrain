import { GameObject } from '../types/custom';
import { Cell } from './cell';

export class Grid implements GameObject {
  rows: number;
  columns: number;
  cells: Cell[][];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.cells = [];

    for (let r = 0; r < rows; ++r) {
      this.cells.push([]);
      for (let c = 0; c < columns; ++c) {
        this.cells[r].push(new Cell(r, c));
      }
    }
  }

  asGameObject(scene: Phaser.Scene, x: number, y: number, cellSize: number): Phaser.GameObjects.Container {
    let cells = [];
    for (let c = 0; c < this.columns; ++c) {
      const cellX = (c - (this.columns / 2)) * cellSize;
      for (let r = 0; r < this.rows; ++r) {
        const cellY = (r - (this.rows / 2)) * cellSize;
        cells.push(this.cells[r][c].asGameObject(scene, cellX, cellY, cellSize));
      }
    }
  
    const container = new Phaser.GameObjects.Container(scene, x, y, cells);
    return container;
  }
}