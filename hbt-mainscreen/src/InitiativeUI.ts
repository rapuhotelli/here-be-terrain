import 'phaser';
import Point = Phaser.Geom.Point;
import BitmapText = Phaser.GameObjects.BitmapText;
import Scene = Phaser.Scene;
import Container = Phaser.GameObjects.Container;

const creatureBoxVectors = [
  new Point(0, 0),
  new Point(50, 50),
  new Point(55, 50),
  new Point(5, 0),

  new Point(50, 0),
  new Point(100, 50),
  new Point(105, 50),
  new Point(55, 0),
];


  
export default class InitiativeUI extends Phaser.Scene {
  
  constructor() {
    super({
      key: 'InitiativeUI',
      active: true,
    });
  }
  
  preload() {
    // http://labs.phaser.io/edit.html?src=src%5Cloader%5Cscene%20payload%5Cscene%20files%20payload.js
    this.load.bitmapFont('gothic', 'assets/gothic.png', 'assets/gothic.xml');
  }

  currentTurn(name: string) {
    const currentCreatureContainer = new Container(this, 0,0);
    const nameBitmapText = this.add.bitmapText(0,0, 'gothic', name, 20);
    const textLength = nameBitmapText.getTextBounds().local;
    this.add
      .line(0,textLength.height,0, 0, textLength.width, 0, 0xffffff)
      .setOrigin(0);
  }
  
  creatureContainer() {
    /*
    this.add
      .polygon(0, 0, creatureBoxVectors, 0xffffff)
      .setOrigin(0, 0);
     */
    
    //this.add.line(0,0, 50, 50)
    // this.currentTurn('puuppa');
    
  }
  
  create() {
    // this.add.rectangle(0,0, 50, 50, 0xffffff);
    this.currentTurn('puuppa');
    this.creatureContainer();
  }
}