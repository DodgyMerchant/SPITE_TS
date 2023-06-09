/**
 * @file generel non system or purpos specific abstract phaser objject classes.
 */

import { DebugActivated, DebugScene } from "../../scenes/DebugScene";
import { sc_MyScene } from "../../scenes/abstract/sc_MyScene";

/**
 * genrell phaser abstract class
 */
export abstract class WorldObject extends Phaser.GameObjects.Sprite implements DebugActivated {
  /**
   * asbstract world object
   * @param scene — The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x — The horizontal position of this Game Object in the world.
   * @param y — The vertical position of this Game Object in the world.
   * @param texture — The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame — An optional frame from the Texture this Game Object is rendering with.
   */
  constructor(
    scene: sc_MyScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    super(scene, x, y, texture, frame);

    this.DEBUG = scene.DEBUG;
  }

  DEBUG: DebugScene;

  FixedMult(delta: number): number {
    return delta / (1000 / this.scene.game.loop.targetFps);
  }
}
