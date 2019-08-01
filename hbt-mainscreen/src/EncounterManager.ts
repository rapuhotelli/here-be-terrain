import MapScene from './map.scene';

// todo encounter loader from server public/encounters

export interface IEncounter {
  key: string;
  name: string;
  cellSize?: number;
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
  loading: number;
  
  constructor() {
    super({
      key: 'EncounterManager',
      active: true,
    });
    this.loading = 1;
  }

  preload() {
    // todo: somehow inject the encounter-to-load here

  }

  create() {
    let { width: screenWidth, height: screenHeight } = this.sys.game.canvas;
    
    // todo can we wait here for socket.io to choose the encounter to load?

    this.load.on('progress', (value:any) => {
      console.log(value);
    });

    this.load.on('filecomplete', (key:any, type:any, texture:any) => {
      if (key === 'jungle1') {
        
        const encounterData = this.cache.json.get('jungle1');

        const text = this.add.text(
          screenWidth/2,
          screenHeight/2,
          encounterData.name,
          { fontFamily: '"Roboto Condensed"', fontSize: 32 },
        );
        text.setPosition(screenWidth/2 - text.getBounds().width/2, screenHeight/2 - text.getBounds().height / 2);
        
        encounterData.layers.map((layer: IEncounterLayer) => {
          this.loading++;
          if (layer.type === 'image') {
            this.load.image(layer.key, layer.resource);
          } else if (layer.type === 'shader') {
            this.load.glsl(layer.key, layer.resource);
          }
        });

        const map = new MapScene(encounterData);
        this.scene.add('MapScene', map, false);
      }
      this.loading--;
      
      if (this.loading === 0) {
        // todo this is where we would wait for DM to start the encounter (with socket io)
        this.scene.start('MapScene');
      }
    });
    
    this.load.json('jungle1', 'encounters/testcampaign/jungle1.json');
    this.load.start();

    // MapScene.scene.moveBelow('UI', 'MapScene')
  }

  update() {

  }
}