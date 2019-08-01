import MapScene from './map.scene';

// todo encounter loader from server public/encounters

export interface IEncounter {
  key: string;
  name: string;
  layers: IEncounterLayer[];
}

export interface IEncounterLayer {
  image: string;
  active: boolean;
}

const testEncounter: IEncounter = {
  key: 'jungle1',
  name: 'Jungle Test Map',
  layers: [
    {
      image: 'jungle1.png',
      active: true,
    },
  ],
};

export default class EncounterManager extends Phaser.Scene {

  constructor() {
    super({
      key: 'EncounterManager',
      active: true,
    });
  }

  preload() {

  }

  create() {
    console.log('creating encounterManager');
    const map = new MapScene(testEncounter);
    this.scene.add('MapScene', map, true);
    // MapScene.scene.moveBelow('UI', 'MapScene')
  }

  update() {

  }
}