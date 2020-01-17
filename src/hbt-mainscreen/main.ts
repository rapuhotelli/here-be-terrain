import 'phaser';

import EncounterManager from './EncounterManager';
import GameConfig = Phaser.Types.Core.GameConfig;
import { DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y } from './params';

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

export const initializeMainScreen = () => {
  var webgl2Canvas = document.createElement('canvas');
  webgl2Canvas.id = 'webgl2Canvas';
  document.body.appendChild(webgl2Canvas);
 // woo
  var webgl2Context = webgl2Canvas.getContext('webgl2', contextCreationConfig);

  class Game extends Phaser.Game {
    constructor(config: GameConfig) {
      super(config);
      console.log('I am Game');
    }
  }

  return new Game({
    type: Phaser.WEBGL,
    canvas: webgl2Canvas,
    // @ts-ignore
    context: webgl2Context,

    scene: EncounterManager,

    width: DEFAULT_RESOLUTION_X,
    height: DEFAULT_RESOLUTION_Y,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  });

};
