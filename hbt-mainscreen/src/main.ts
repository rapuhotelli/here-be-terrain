import 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;

import EncounterManager from './EncounterManager';

console.log('I run');

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
    console.log('I am Game');
  }
}

window.onload = () => {
  const game = new Game({
    scene: [
      EncounterManager,
      // todo: UIScene
    ],
    width: 1280,
    height: 720,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  });
};