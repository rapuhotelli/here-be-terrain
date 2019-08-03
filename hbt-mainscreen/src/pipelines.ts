import 'phaser';
import WebGLRenderer = Phaser.Renderer.WebGL.WebGLRenderer;

interface IPipelineConfig {
  game: Phaser.Game;
  renderer: WebGLRenderer;
  topology?: any;
  vertShader?: string;
  fragShader?: string;
  vertexCapacity?: number;
  vertexSize?: number;
}


export const createTextureTintPipeline = (game: Phaser.Game, fragShader: string, key: string) => {
  const pipeline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline({
    game: game,
    renderer: game.renderer,
    fragShader: fragShader,
  });
  return (<Phaser.Renderer.WebGL.WebGLRenderer>game.renderer).addPipeline(key, pipeline);
};
