import 'phaser';
import ParticleEmitterConfig = Phaser.Types.GameObjects.Particles.ParticleEmitterConfig;

type Base64Png = string;

interface IDirectionVector {
  x: number;
  y: number;
}

interface IEffectLayer {
  x: number;
  y: number;
}

interface IStaticImageLayer {
  x: number;
  y: number;
}

interface IParticle extends ParticleEmitterConfig {}

interface IStaticParticleEmitterArea {
  particleConfig: ParticleEmitterConfig;
  x: number;
  y: number;
  mask: Base64Png;
  area: {
    width: number;
    height: number;
    spacing: number;
  };
  direction: IDirectionVector;
  particleResource: string;
}

interface IEncounterState {
  rootTextureMap: string; // list of connected maps
  fogOfWarTexture: Base64Png;
  particleEmitters: IStaticParticleEmitterArea[];
}
