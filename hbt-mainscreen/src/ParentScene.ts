import * as socketIo from 'socket.io-client';
import EncounterManager from './EncounterManager';

const socket = socketIo.connect('/screen');
socket.on('welcome', (data: string) => {
  console.log(data);
});

socket.on('reload', () => {
  window.location.href = `/`;
  // window.location.reload();
});

export default class ParentScene extends Phaser.Scene {
  private encounterId: number;

  init() {
    this.encounterId = 0;
  }

  startScene(path: string) {
    this.scene.add(
      `EncounterManager${this.encounterId++}`,
      EncounterManager,
      true,
      { encounterPath: path },
    );
  }

  create() {
    if (window.location.hash) {
      const encounterPath = window.location.hash.substring(2);
      this.startScene(encounterPath);
    }
    socket.on('load-encounter', (path: string) => {
      console.log('starting a scene:', path);
      window.location.href = `/#/${path}`;
      window.location.reload();
    });
  }

}