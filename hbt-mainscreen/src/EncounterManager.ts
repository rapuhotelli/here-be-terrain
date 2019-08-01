import MapScene from './map.scene';

// todo encounter loader from server public/encounters

export interface IEncounter {
  key: string;
  name: string;
  layers: IEncounterLayer[];
}

export interface IEncounterLayer {
  key: string;
  type: 'image' | 'shader';
  resource: string;
  active: boolean;
  position?: {x: number, y: number};
  dimensions?: {width: number, height: number};
}

export default class EncounterManager extends Phaser.Scene {

  constructor() {
    super({
      key: 'EncounterManager',
      active: true,
    });
  }

  preload() {
    // todo: somehow inject the encounter-to-load here
    this.load.json('jungle1', 'encounters/testcampaign/jungle1.json');
  }

  create() {
    console.log('creating encounterManager');
    const encounterData = this.cache.json.get('jungle1');
    const map = new MapScene(encounterData);
    this.scene.add('MapScene', map, true);
    // MapScene.scene.moveBelow('UI', 'MapScene')
  }

  update() {

  }
}