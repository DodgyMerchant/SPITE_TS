import { InputFunction } from "./stateMoveInput";
import { StateMovement } from "./stateMovement";
import { ComplexState, StateObject } from "./states";

export class BaseState implements ComplexState {
  readonly name: string;
  /**
   * if input enabled.
   */
  readonly input: boolean;
  /**
   * if new movement is possible.
   */
  readonly move: boolean;
  /**
   * if ALL movement is prohibited and stopped.
   */
  readonly stopped: boolean;

  /**
   *
   * @param name name of the enum.
   * @param input if input enabled.
   * @param move if new movement is possible.
   * @param stopped if ALL movement is prohibited and stopped.
   */
  constructor(name: string, input: boolean, move: boolean, stopped: boolean) {
    this.name = name;
    this.input = input;
    this.move = move;
    this.stopped = stopped;
  }

  apply<T extends BaseStateClass>(stateObj: T) {
    stateObj.moveEnabled = this.input;
    stateObj.inputEnabled = this.move;
    stateObj.moveStopped = this.stopped;
  }

  undo<T extends BaseStateClass>(stateObj: T) {
    if (stateObj.moveEnabled) return;
    // stateObj.moveEnabled = this.input;
    // stateObj.inputEnabled = this.move;
    // stateObj.moveStopped = this.stopped;
  }

  toString(): string {
    return this.name;
  }
}

/**
 * input states
 */
export abstract class BaseStateClass extends StateMovement implements StateObject<BaseState> {
  /**
   * states for the object
   */
  public static readonly BASE_STATES = {
    /**
     * obj is free to move.
     */
    FREE: new BaseState("free", true, true, false),
    /**
     * obj input is disabled.
     * But movement isnt cancelled.
     */
    STUNNED: new BaseState("stunned", false, false, false),
    /**
     * obj is controlled by scene.
     * Input is blocked but movement isnt frozen.
     */
    CONTROLLED: new BaseState("controlled", false, true, false),
    /**
     * obj is frozen.
     * Input and movement is disallowed.
     */
    FROZEN: new BaseState("frozen", false, false, true),
  };

  /**
   *
   *
   * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x The horizontal position of this Game Object in the world.
   * @param y The vertical position of this Game Object in the world.
   * @param texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame An optional frame from the Texture this Game Object is rendering with.
   * @param state state. default FREE.
   * @param inputMeth Method called to get input for movement.
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number | undefined,
    state: BaseState = BaseStateClass.BASE_STATES.FREE,
    inputMeth?: InputFunction
  ) {
    super(scene, x, y, texture, frame, inputMeth, undefined, undefined, undefined);

    this._state = state;
    this._stateSet(state);

    BaseStateClass.BASE_STATES.CONTROLLED.move;
  }

  private _state: BaseState;

  /**
   * set state of this
   * @param state
   */
  private _stateSet(state: BaseState) {
    state.apply(this);

    this._state = state;
  }
  private _stateUnset(state: BaseState) {
    state.undo(this);
  }

  /**
   * vector to be used and thrown away for calculations
   * dont save stuff in it
   * alsways reset before using
   * @type {Phaser.Math.Vector2} type
   */
  workVec: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  /**
   * sets objects base state.
   * @param newState new base state.
   */
  stateSet(newState: BaseState) {
    this._stateUnset(this._state);

    this._stateSet(newState);
  }

  /**
   * gets objects base state.
   */
  stateGet(): BaseState {
    return this._state;
  }

  // /**
  //  * runs continuously
  //  * moves obj
  //  */
  // stateUpdate() {
  //   if (this.moveCanMoveGet() && this.inputCheck(inputVec) && this.moveInputMethod) {
  //     // let _x = this.workVec.x;
  //     // let _y = this.workVec.y;
  //     let _spd = this.moveGetSpeed();

  //     //applying movement speed
  //     this.workVec.scale(_spd);

  //     //apply movmeent
  //     super.phyMoveAdd(this.workVec);
  //     // this.thrust(this.workVec.length()); does the same thing
  //   }
  // }
}
