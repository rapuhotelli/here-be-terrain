import 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;

import EncounterManager from './EncounterManager';

var webgl2Canvas = document.createElement('canvas');
webgl2Canvas.id = 'webgl2Canvas';
document.body.appendChild(webgl2Canvas);

var contextCreationConfig = {
  alpha: false,
  depth: false,
  antialias: true,
  premultipliedAlpha: true,
  stencil: true,
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false,
  powerPreference: 'default',
};

var webgl2Context = webgl2Canvas.getContext('webgl2', contextCreationConfig);


export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
    console.log('I am Game');
  }
}

//window.onload = () => {
  
const game = new Game({
  type: Phaser.WEBGL,
  canvas: webgl2Canvas,
  // @ts-ignore
  context: webgl2Context,
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
//};