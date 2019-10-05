import MapScene from './map.scene';
import SplashscreenScene from './SplashscreenScene';

import { IEncounter, IEncounterLayer } from '../../hbt-common/interfaces';
import { EncounterEvents } from '../../hbt-common/socketIoEvents';
import { DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y } from './params';
import socket from './socket';

const AvailableShaders = [
  'fogofwar',
  'fire',
  'lava',
  'water',
];

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
    socket.on(EncounterEvents.SHOW, (path: string) => {
      this.showScene(path);
    });
    socket.on(EncounterEvents.LAYER_UPDATE, (path: string, layerId: string, pngDataUrl: string) => {
      this.addLayerToScene(path, layerId, pngDataUrl);
    });
  }

  preload() {
    AvailableShaders.forEach((key) => {
      const filename = `${key}.frag`;
      this.load.glsl(key, `shaders/${filename}`);
    });
    this.load.once('complete', () => {
      console.log('shaders loaded!', this.cache.shader.entries.keys());
    });
  }
  
  showScene(path: string) {
    const newSceneId = `scene.${path}`;
    const sceneManager: Phaser.Scenes.SceneManager = this.game.scene;

    if (newSceneId === this.currentSceneId) return;
    if (sceneManager.getIndex(newSceneId) < 0) {
      return this.loadScene(path, true);
    }

    this.changeToScene(newSceneId);
  }

  loadScene(path: string, showWhenReady: boolean = false) {
    const newSceneId = `scene.${path}`;
    const newEncounterId = `encounter.${path}`;
    const sceneManager: Phaser.Scenes.SceneManager = this.game.scene;
    let map: Phaser.Scene;

    if (newSceneId === this.currentSceneId) {
      socket.emit(EncounterEvents.READY);
      return;
    }

    if (sceneManager.getIndex(newSceneId) >= 0) {
      socket.emit(EncounterEvents.READY);
      if (showWhenReady) {
        this.changeToScene(newSceneId);
      }
      return;
    }
      
    // this.load.on('progress', (value: any) => {
    //   console.log(value);
    // });

    this.load.once('filecomplete', () => {
      const encounterData: IEncounter = this.cache.json.get(newEncounterId);

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
            if (this.cache.shader.has(layer.key)) {
              if (layer.customUniforms) {
                const cachedShader = this.cache.shader.get(layer.key);
                cachedShader.uniforms = layer.customUniforms;
                this.cache.shader.add(layer.key, cachedShader);
              }
            } else if(layer.shader) {
              this.load.glsl(layer.key, `shaders/${layer.shader}`);
              if (layer.customUniforms) {
                this.load.once('complete', () => {
                  if (this.cache.shader.has(layer.key)) {
                    const cachedShader = this.cache.shader.get(layer.key);
                    cachedShader.uniforms = layer.customUniforms;
                    this.cache.shader.add(layer.key, cachedShader);
                  }
                });
              }
            }
          }
        }
      });

      map = new MapScene(encounterData, { key: newSceneId });
    });

    this.load.once('complete', () => {
      if (map) {
        sceneManager.add(newSceneId, map, false);
        socket.emit(EncounterEvents.READY);
      }
      if (showWhenReady) {
        this.changeToScene(newSceneId);
      }
    });
    
    this.load.json(newEncounterId, `${path}.json`);
    this.load.start();
  }

  addLayerToScene(path: string, layerId: string, pngDataUrl: string) {
    const sceneId = `scene.${path}`;
    const sceneManager: Phaser.Scenes.SceneManager = this.game.scene;
    const imageId = `${sceneId}/${layerId}`;
    const scene = sceneManager.getScene(sceneId);
    if (this.textures.exists(imageId)) {
      const child = scene.children.getByName(imageId);
      if (child) scene.children.remove(child);
      this.textures.remove(imageId);
      this.textures.addBase64(imageId, pngDataUrl);
    } else {
      this.textures.addBase64(imageId, pngDataUrl);
    }
    this.textures.once('addtexture', () => {
      if (AvailableShaders.includes(layerId)) {
        const mask = scene.add.image(DEFAULT_RESOLUTION_X / 2, DEFAULT_RESOLUTION_Y / 2, imageId)
          .setName(imageId)
          .setDisplaySize(DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y)
          .setVisible(false)
          .createBitmapMask();
        scene.add.shader(layerId, DEFAULT_RESOLUTION_X / 2, DEFAULT_RESOLUTION_Y / 2, DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y)
          .setMask(mask)
          .setDepth(1);
      } else {
        const img = scene.add.image(DEFAULT_RESOLUTION_X / 2, DEFAULT_RESOLUTION_Y / 2, imageId);
        img.setName(imageId);
        img.setDisplaySize(DEFAULT_RESOLUTION_X, DEFAULT_RESOLUTION_Y);
        img.setDepth(1);
      }
    });
  }

  changeToScene(sceneId: string) {
    const sceneManager: Phaser.Scenes.SceneManager = this.game.scene;
    sceneManager.switch(this.currentSceneId, sceneId);
    this.currentSceneId = sceneId;
  }
}