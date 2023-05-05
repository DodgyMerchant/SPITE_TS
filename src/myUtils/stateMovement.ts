import { sc_MyScene } from "../scenes/abstract/sc_MyScene";
import { MoveInputFunction, MovementInput } from "./stateMoveInput";

/**
 * input states
 */
export abstract class StateMovement extends MovementInput {
  /**
   *
   * @param scene — The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x — The horizontal position of this Game Object in the world.
   * @param y — The vertical position of this Game Object in the world.
   * @param texture — The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame — An optional frame from the Texture this Game Object is rendering with.
   * @param inputMeth Method called to get input for movement.
   * @param inputEnabled if input enabled. default true.
   * @param moveEnabled if new movement is allowed enabled. default true.
   * @param moveStopped if all, old and new, movement will be prohibited. movement enabled. default false.
   */
  constructor(
    scene: sc_MyScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number | undefined,
    inputMeth?: MoveInputFunction,
    inputEnabled: boolean = true,
    moveEnabled: boolean = true,
    moveStopped: boolean = false
  ) {
    super(scene, x, y, texture, frame, inputMeth, inputEnabled);

    this.moveEnabled = moveEnabled;
    this.moveStopped = moveStopped;
  }

  /**
   * if new movement is possible. If disabled old movement vectors will still be applied
   */
  private _moveEnabled: boolean = true;
  /**
   * if new movement is possible.
   * If disabled old movement vectors will still be applied.
   * if enabled will set moveStopped to false.
   */
  public get moveEnabled(): boolean {
    return this._moveEnabled;
  }
  public set moveEnabled(bool: boolean) {
    this._moveEnabled = bool;

    //if all movement stopped disable movement.
    if (bool) this.moveStopped = false;
  }

  /**
   * if ALL movement is prohibited and stopped.
   * If set to true moveEnabled will be set to false.
   */
  private _moveStop: boolean = false;
  /**
   * if ALL movement is prohibited and stopped.
   * If set to true moveEnabled will be set to false.
   */
  public get moveStopped(): boolean {
    return this._moveStop;
  }
  public set moveStopped(bool: boolean) {
    this._moveStop = bool;

    //if all movement stopped disable movement.
    if (bool) this.moveEnabled = false;
  }

  /**
   * checks if object can add new movement
   * @returns if the object can move.
   */
  MoveCheck(): boolean {
    return this.moveEnabled && !this.moveStopped;
  }

  update(_time: number, delta: number) {
    if (this.MoveCheck()) {
      //get input
      let vec2 = this.MoveInputGet();

      if (vec2 && this.MoveInputCheck()) {
        let fm = this.FixedMult(delta);

        //set position and multiply by fixed multiplier.
        this.setPosition(this.x + vec2.x * fm, this.y + vec2.y * fm);
      }

      //applying movement speed
      // this.workVec.scale(_spd);

      //apply movmeent
      // super.phyMoveAdd(this.workVec);
      // this.thrust(this.workVec.length()); does the same thing
    }
  }
}
