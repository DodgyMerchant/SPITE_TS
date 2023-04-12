import { WorldObject } from "./abstract";

/**
 * input states
 */
export abstract class StateMoveInput extends WorldObject {
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
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number | undefined,
    inputMeth?: InputFunction,
    inputEnabled: boolean = true
  ) {
    super(scene, x, y, texture, frame);

    if (inputMeth) this.inputMethod = inputMeth;
    this.inputEnabled = inputEnabled;
  }

  /**
   * Method called to get input for movement.
   * Use inputGet() to get input.
   */
  private _inputMethod: InputFunction | undefined = undefined;
  public get inputMethod(): InputFunction | undefined {
    return this._inputMethod;
  }
  public set inputMethod(value: InputFunction | undefined) {
    this._inputMethod = value;
  }

  /**
   * if input enabled
   */
  private _inputEnabled: boolean = true;
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
   */
  inputGet(): InputVector | undefined {
    // console.log("mult: ", mult);

    if (this.inputEnabled && this.inputMethod) {
      return this.inputMethod(this._inputVector);
    }
    return undefined;
  }

  /**
   * checks if the given input vector has received input.
   * @returns boolean.
   */
  inputCheck(inputVector: InputVector | undefined): boolean {
    if (inputVector) return inputVector.x != 0 || inputVector.y != 0;

    return false;
  }
}

class InputVector extends Phaser.Math.Vector2 {}

/**
 * Method called to get input for movement.
 */
export type InputFunction =
  /**
   * @param vec2 optional vector to overwrite. Will generate new vector if undefined.
   * @returns given overwritten or new vector. vector with a limit of 1.
   */
  (vec2: Phaser.Math.Vector2) => Phaser.Math.Vector2;
