import { DEFAULT_CELL_SIZE, DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y } from '../params';

export default class MainGrid extends Phaser.Scene {
  grid: Phaser.GameObjects.Grid;
  offsetX: number;
  offsetY: number;

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    const gridWidth = screenWidth + DEFAULT_CELL_SIZE * 2;
    const gridHeight = screenHeight + DEFAULT_CELL_SIZE * 2;

    this.grid = this.add.grid(
      gridWidth/2 - DEFAULT_CELL_SIZE,
      gridHeight/2 - DEFAULT_CELL_SIZE,
      gridWidth,
      gridHeight,
      DEFAULT_CELL_SIZE,
      DEFAULT_CELL_SIZE,
      0xffffff,
      0,
    );

    this.grid.setAltFillStyle(0xffffff, 0.2);
    this.grid.setOutlineStyle();
    this.applyOffsetX();
    this.applyOffsetY();
  }


  /**
   * Move the grid by an offset. No arguments resets axis to center.
   * @param x
   */
  applyOffsetX(x?: number) {
    if (!x) {
      const remainder = DEFAULT_RESOLUTION_X % DEFAULT_CELL_SIZE;
      if (remainder !== 0) {
        this.offsetX = 0;
        this.grid.setPosition(this.grid.x + remainder/2, this.grid.y);
      }
      return;
    }
    this.offsetX += x;
    this.grid.setPosition(this.grid.x + x, this.grid.y);
  }

  applyOffsetY(y?: number) {
    if (!y) {
      const remainder = DEFAULT_RESOLUTION_Y % DEFAULT_CELL_SIZE;
      if (remainder !== 0) {
        this.offsetY = 0;
        this.grid.setPosition(this.grid.x, this.grid.y + remainder/2);
      }
      return;
    }
    this.offsetY += y;
    this.grid.setPosition(this.grid.x, this.grid.y + y);
  }

  update(time: number, delta: number) {
    // this.applyOffsetY(1);
  }
}