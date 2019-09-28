import MapScene from './map.scene';
import SplashscreenScene from './ParentScene';

import { EncounterEvents } from '../../hbt-common/socketIoEvents';
import socket from './socket';

export interface IEncounter {
  key: string;
  name: string;
  cellSize?: number;
  shaders: IEncounterShader[];
  layers: IEncounterLayer[];
}

export interface IEncounterShader {
  key: string;
  shader: string;
}

export interface IEncounterLayer {
  key: string;
  type: 'texture' | 'shader';
  texture?: string;
  shader?: string;
  active: boolean;
  position?: {x: number, y: number};
  dimensions?: {width: number, height: number};
  customUniforms?: { type: string, value: any };
}

export default class EncounterManager extends Phaser.Scene {
  private currentSceneId: string;

  create() {
    // load first scene
    const splashscreenId = 'scene.splashscreen';
    const splashscreenScene = new SplashscreenScene({ key: splashscreenId });
    this.game.scene.add(splashscreenId, splashscreenScene, true);
    this.currentSceneId = splashscreenId;

    // set up loader
    socket.on(EncounterEvents.LOAD, (path: string) => {
      this.loadScene(path);
    });
  }

  loadScene(path: string) {
    const newSceneId = `scene.${path}`;
    const sceneManager: Phaser.Scenes.SceneManager = this.game.scene;

    if (newSceneId === this.currentSceneId) return;

    if (sceneManager.getIndex(newSceneId) >= 0) {
      this.changeToScene(newSceneId);
    } else {
      this.load.on('progress', (value: any) => {
        console.log(value);
      });
  
      this.load.once('filecomplete', () => {
        const encounterData: IEncounter = this.cache.json.get('encounter');
  
        if (encounterData.shaders) {
          encounterData.shaders.map(shader => {
            this.load.text(shader.key, `shaders/${shader.shader}`);
          });
        }
        
        encounterData.layers.map((layer: IEncounterLayer) => {
          if (['texture', 'shader'].includes(layer.type)) {
            if (layer.type === 'texture') {
              this.load.image(layer.key, `modules/${layer.texture}`);
              if (layer.shader) {
                this.load.glsl(layer.shader, `shaders/${layer.shader}`);
              }
            } else if (layer.type === 'shader') {
              this.load.glsl(layer.key, `shaders/${layer.shader}`);
              if (layer.customUniforms) {
                this.load.once('complete', () => {
                  console.log('runs complete in eventmanager');
                  if (this.cache.shader.has(layer.key)) {
                    const cachedShader = this.cache.shader.get(layer.key);
                    cachedShader.uniforms = layer.customUniforms;
                    this.cache.shader.add(layer.key, cachedShader);
                  }
                });
              }
            }
          }
        });
  
        const map = new MapScene(encounterData, { key: newSceneId });
        sceneManager.add(newSceneId, map, false);
      });
  
      this.load.once('complete', () => {
        // todo game.scene is where we would wait for DM to start the encounter (with socket io)
        this.changeToScene(newSceneId);
      });
      
      this.load.json('encounter', `${path}.json`);
      this.load.start();
    }
  }

  changeToScene(sceneId: string) {
    const sceneManager: Phaser.Scenes.SceneManager = this.game.scene;
    sceneManager.switch(this.currentSceneId, sceneId);
    this.currentSceneId = sceneId;
  }
}