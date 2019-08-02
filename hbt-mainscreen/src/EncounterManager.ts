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
    
    const hbdText = this.add.text(
      screenWidth/2,
      screenHeight/2,
      'Here Be Terrain!',
      { fontFamily: 'cursive', fontSize: 72 },
    );
    
    const subText = this.add.text(
      screenWidth/2,
      screenHeight/2,
      '~ Is waiting for Dungeon Master ~',
      { fontFamily: 'cursive', fontSize: 32 },
    );

    hbdText.setPosition(screenWidth/2 - hbdText.getBounds().width/2, screenHeight/2 - hbdText.getBounds().height);
    subText.setPosition(screenWidth/2 - subText.getBounds().width/2, screenHeight/2 + hbdText.getBounds().height);

    // todo can we wait here for socket.io to choose the encounter to load?
    setTimeout(() => {
      
      this.load.on('progress', (value:any) => {
        console.log(value);
      });
  
      this.load.on('filecomplete', (key:any, type:any, texture:any) => {
        if (key === 'jungle1') {
          
          const encounterData = this.cache.json.get('jungle1');
  
          subText.setText(encounterData.name);
          subText.setPosition(screenWidth/2 - subText.getBounds().width/2, screenHeight/2 + hbdText.getBounds().height);
          
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
    }, 3000);

  }

  update() {

  }
}