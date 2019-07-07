import 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;

console.log('I run');

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
    console.log('I am Game');
  }
}



window.onload = () => {
  const game = new Game({});
};