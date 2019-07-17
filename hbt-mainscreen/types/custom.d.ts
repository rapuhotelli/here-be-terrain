export interface GameObject {
  addToScene: (scene: Phaser.Scene, ...otherArgs: any[]) => void; 
}