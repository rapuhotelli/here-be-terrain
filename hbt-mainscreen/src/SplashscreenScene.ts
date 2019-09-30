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
  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;

    const hbdText = this.add.text(
      screenWidth/2,
      screenHeight/2,
      'Here Be Terrain',
      { fontFamily: 'ExocetBlizzardLight', fontSize: 64 },
    );

    const subText = this.add.text(
      screenWidth/2,
      screenHeight/2,
      '~ Waiting for Dungeon Master ~',
      { fontFamily: 'ExocetBlizzardLight', fontSize: 32 },
    );

    const ipText = this.add.text(
      screenWidth/2,
      screenHeight/2,
      '',
      { fontFamily: 'ExocetBlizzardLight', fontSize: 16 },
    );

    hbdText.setPosition(screenWidth/2 - hbdText.getBounds().width/2, screenHeight/2 - hbdText.getBounds().height);
    subText.setPosition(screenWidth/2 - subText.getBounds().width/2, screenHeight/2 + subText.getBounds().height);

    getJSON('/ip', (ip) => {
      ipText.setText(ip.ip);
      ipText.setPosition(
        screenWidth/2 - ipText.getBounds().width/2,
        screenHeight/2 + hbdText.getBounds().height + subText.getBounds().height,
      );
    });
  }

}