import * as socketIo from 'socket.io-client';
import EncounterManager from './EncounterManager';

const socket = socketIo.connect('/screen');
socket.on('welcome', (data: string) => {
  console.log(data);
});

export default class ParentScene extends Phaser.Scene {
  private encounterId: number;

  init() {
    this.encounterId = 0;
  }

  create() {
    console.log('waiting on bullshit');
    socket.on('load-encounter', (data: string) => {
      console.log('parentScene starting');
      this.scene.add(
        `EncounterManager${this.encounterId++}`,
        EncounterManager,
        true,
        { encounterPath: data },
      );
    });
  }

}