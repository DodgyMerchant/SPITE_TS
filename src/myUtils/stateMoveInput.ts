import { WorldObject } from "../gameObj/abstract/abstract";
import { sc_MyScene } from "../scenes/abstract/sc_MyScene";

/**
 * Manages movment input abstractly.
 * can be very powerfull with states.
 */
export abstract class MovementInput extends WorldObject {
  /**
   *
   *
   * @param scene — The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x — The horizontal position of this Game Object in the world.
   * @param y — The vertical position of this Game Object in the world.
   * @param texture — The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame — An optional frame from the Texture this Game Object is rendering with.
   * @param inputMeth Method called to get input for movement.
   * @param enabled if input enabled. default true.
   */
  constructor(
    scene: sc_MyScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number | undefined,
    inputMeth?: MoveInputFunction,
    inputEnabled: boolean = true
  ) {
    super(scene, x, y, texture, frame);

    if (inputMeth) this._inputMethod = inputMeth;
    this.inputEnabled = inputEnabled;
  }

  /**
   * Method called to get input for movement.
   * Use inputGet() to get input.
   */
  private _inputMethod: MoveInputFunction | undefined = undefined;

  /**
   * if input enabled.
   */
  private _inputEnabled: boolean = true;
  /**
   *
   */
  public get inputEnabled(): boolean {
    return this._inputEnabled;
  }
  public set inputEnabled(bool: boolean) {
    this._inputEnabled = bool;
  }

  /**
   * input vector used for storing input data.
   * @type {Phaser.Math.Vector2} type
   */
  private _inputVector: InputVector = new InputVector();

  /**
   * Updates and returns the input vector.
   * Returns undefiend if input is disabled or if no input method was defind.
   * Use inputCheck to check if the input vector has received input.
   * @returns input vector or undefined if no input.
   *
   * This vector is saved internally and repurposed for inputs for performance.
   * No need to save the vector.
   */
  MoveInputGet(): InputVector | undefined {
    // console.log("mult: ", mult);

    if (this.inputEnabled && this._inputMethod) {
      return this._inputMethod(this._inputVector);
    }
    return undefined;
  }

  /**
   * checks if the given input vector has received input.
   * @returns boolean.
   */
  MoveInputCheck(): boolean {
    if (this._inputVector) return this._inputVector.x != 0 || this._inputVector.y != 0;

    return false;
  }
}

/**
 * input vector.
 */
class InputVector extends Phaser.Math.Vector2 {}

/**
 * Method called to get input for movement.
 */
export type MoveInputFunction =
  /**
   * @param vec2 vector to overwrite and return.
   * @returns given overwritten or new vector. vector with a limit of 1.
   */
  (vec2: Phaser.Math.Vector2) => Phaser.Math.Vector2;
