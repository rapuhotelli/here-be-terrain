const getJSON = (path: string, callback: (response: any) => void) => {
  console.log('loading', path);
  var request = new XMLHttpRequest();
  request.open('GET', path, true);

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      callback(JSON.parse(this.response));
    } else {
      console.error('bad data');
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send();
};

export default class SplashscreenScene extends Phaser.Scene {

  preload() {
    this.load.bitmapFont('gothic', 'assets/gothic.png', 'assets/gothic.xml');
  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    this.add.bitmapText(
      screenWidth/2,
      screenHeight/3,
      'gothic',
      'Here Be Terrain',
      30,
      ).setOrigin(0.5).setCenterAlign();

    const subText = this.add.bitmapText(
      screenWidth/2,
      screenHeight/2,
      'gothic',
      '~ Waiting for Dungeon Master ~',
      20,
    ).setOrigin(0.5).setCenterAlign();

    const ipText = this.add.bitmapText(
      screenWidth/2,
      (screenHeight/4)*3,
      'gothic',
      '',
      20,
    ).setOrigin(0.5).setCenterAlign();

    getJSON('/ip', (ip) => {
      ipText.setText(ip.ip);
    });
  }

}