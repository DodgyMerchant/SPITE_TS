import { BaseState, BaseStateClass } from "./abstract/baseStates";
import { ComplexState, StateClass } from "./abstract/states";

class PlayerState extends StateClass implements ComplexState {
  /**
   *
   * @param name name of the enum.
   * @param recovery Stamina recovery amount.
   * @param time Stamina recovery time.
   */
  constructor(name: string, baseState: BaseState, recovery: number, time: number) {
    super(name);
    this.baseState = baseState;
    this.staminaRecovery = recovery;
    this.staminaTime = time;
  }

  /**
   * Base state.
   */
  readonly baseState: BaseState;
  /**
   * Stamina recovery amount.
   */
  readonly staminaRecovery: number;
  /**
   * Stamina recovery time.
   */
  readonly staminaTime: number;

  apply(player: Player): void {
    player.stateSet(player.playerState.baseState);
  }
  undo(player: Player): void {
    throw new Error("Method not implemented.");
    if (player) return;
  }
}

/**
 * player Object class
 */
export class Player extends BaseStateClass {
  //#region stamina

  readonly staminaMax: number = 100;
  stamina = this.staminaMax;

  //#endregion stamina
  //#region color

  /**
   * Default tint color, red.
   */
  readonly ColorDefault: number = Phaser.Display.Color.GetColor(144, 11, 9);

  //#endregion color
  //#region states

  private _playerState: PlayerState;
  public get playerState(): PlayerState {
    return this._playerState;
  }
  public set playerState(value: PlayerState) {
    this._playerState.undo(this);
    this._playerState = value;
    this._playerState.apply(this);
  }

  //#endregion states

  prog: number = 0;

  /**
   * create a Player Object.
   * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x The horizontal position of this Game Object in the world.
   * @param y The vertical position of this Game Object in the world.
   * @param texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame An optional frame from the Texture this Game Object is rendering with.
   * @param state state. default FREE.
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined,
    state: PlayerState = Player.PLAYER_STATES.IDLE
  ) {
    super(scene, x, y, texture, frame, state.baseState);

    //red tint
    this.setTint(this.ColorDefault);

    //state
    this._playerState = state;
    this._playerState.apply(this);

    this.play("an_player_idle_idle");

    /** keyboard input keys */
    // this.input_Keyboard = this.scene.input.keyboard.addKeys({
    //   up: Phaser.Input.Keyboard.KeyCodes.W,
    //   down: Phaser.Input.Keyboard.KeyCodes.S,
    //   left: Phaser.Input.Keyboard.KeyCodes.A,
    //   right: Phaser.Input.Keyboard.KeyCodes.D,
    //   jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    // });

    console.log(this.anims.currentAnim);
  }

  /**
   * Player states
   */
  static readonly PLAYER_STATES = {
    IDLE: new PlayerState("idle", BaseStateClass.BASE_STATES.FREE, 0, 0),
    DOWNED: new PlayerState("downed", BaseStateClass.BASE_STATES.FREE, 0, 0),
    COMBAT: new PlayerState("combat", BaseStateClass.BASE_STATES.FREE, 0, 0),
    EXHAUSTED: new PlayerState("exhausted", BaseStateClass.BASE_STATES.FREE, 0, 0),
  };

  protected preUpdate(time: number, delta: number): void {
    // console.log("Player pre update");

    /**
     * AVOID animation progrss methoids and variables.
     * they dont work.
     * setProgress +
     */

    this.prog = Math.floor(time / 1000) % this.anims.getTotalFrames();
    // time
    this.anims.setCurrentFrame(this.anims.currentAnim.frames[this.prog]);

    //updates internal animations???????????????
    this.anims.update(time, delta);
  }

  update(time: number, delta: number): void {
    // console.log("Player update");
    // console.log(time, delta);
  }
}
