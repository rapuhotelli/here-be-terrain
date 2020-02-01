import 'phaser';
import { EncounterEvents } from '../../hbt-common/socketIoEvents';
import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import PackFileConfig = Phaser.Types.Loader.FileTypes.PackFileConfig;
import socket from './socket';
import PackFile = Phaser.Loader.FileTypes.PackFile;

type Resources = string[];

const addImage = (scene: Phaser.Scene, texture: string) =>
  scene.add.image(0, 0, texture).setOrigin(0);

type ResourcePointer = string | string[];


const loadResourcePacks = (scene: Phaser.Scene, resources: ResourcePointer) => {
  if (typeof resources === 'string') resources = [resources];

  const loader = new LoaderPlugin(scene);
  resources.map((r, i) =>
    loader.pack(`encounter${i}`, `/modules${r}`, `encounter${i}`),
  );
  loader.on('complete', () => {
    addImage(scene, 'ground');
  });
  return loader;
};


const updateEncounterState = (scene: Phaser.Scene) => {

};


export default class MainScene extends Phaser.Scene {

  currentResource: PackFile;

  updateEncounterState(path: string) {

  }

  preload() {
    // this.load.pack('encounter', '/modules/generic/forestroad/pack.json', 'encounter');
    this.load.json('resources', 'e', 'resources');
  }

  create() {

    socket.on(EncounterEvents.LOAD, (path: string) => {
      const loader = loadResourcePacks(this, path); // .start();
      socket.emit(EncounterEvents.ENCOUNTER_STATE_REQUEST);
    });

    socket.on(EncounterEvents.ENCOUNTER_STATE_UPDATE, (campaign, encounter, layerId, layerData) => {

    });


    // const resources: Resources = this.cache.json.get('resources');
    // todo ei näin, loadaa vaan se joka pyydetään
    // loadResourcePacks(this, resources).start();

    console.log();

    // addImage(this,'ground');
  }
}
