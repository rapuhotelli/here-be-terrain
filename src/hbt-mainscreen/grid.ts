import { GameObject } from '../../types/custom';
import { Cell } from './cell';

export class Grid implements GameObject {
  rows: number;
  columns: number;
  cells: Cell[][];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.cells = [];

    for (let row = 0; row < rows; ++row) {
      this.cells.push([]);
      for (let col = 0; col < columns; ++col) {
        this.cells[row].push(new Cell(row, col));
      }
    }
  }

  addToScene(scene: Phaser.Scene, gridX: number, gridY: number, cellSize: number): void {
    const halfCellSize = cellSize / 2;
    for (let col = 0; col < this.columns; ++col) {
      const cellX = (col - (this.columns / 2)) * cellSize + halfCellSize + gridX;
      for (let row = 0; row < this.rows; ++row) {
        const cellY = (row - (this.rows / 2)) * cellSize + halfCellSize + gridY;
        this.cells[row][col].addToScene(scene, cellX, cellY, cellSize);
      }
    }
  }
}