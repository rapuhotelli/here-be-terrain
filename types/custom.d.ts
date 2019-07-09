export interface GameObject {
  asGameObject: (scene: Phaser.Scene, ...otherArgs: any[]) => Phaser.GameObjects.GameObject; 
}