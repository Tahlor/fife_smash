import { Engine } from './core/Engine';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    console.error('Canvas element #game-canvas not found.');
    return;
  }

  const engine = new Engine(canvas);
  engine.init();

  // Handle window resizing
  window.addEventListener('resize', () => {
    engine.renderer.resize();
  });
});
