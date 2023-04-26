import { PBIClass } from "./abstract/PBI";
import { BaseState, BaseStateClass } from "../myUtils/baseStates";
import { ComplexState, StateClass } from "../myUtils/states";

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
    player.baseSet(player.playerState.baseState);
  }
  undo(player: Player): void {}
}

/**
 * player Object class
 */
export class Player extends PBIClass {
  playerInput: { [i: string]: Phaser.Input.Keyboard.Key } | undefined;

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

    this.play("an_player_TEST");

    /** keyboard input keys */
    let keyb = this.scene.input.keyboard;
    if (keyb)
      this.playerInput = {
        W: keyb.addKey("W"),
        A: keyb.addKey("A"),
        S: keyb.addKey("S"),
        D: keyb.addKey("D"),
      };

    this.playerInput?.W;
  }

  //#region color

  /**
   * Default tint color, red.
   */
  readonly ColorDefault: number = Phaser.Display.Color.GetColor(144, 11, 9);

  //#endregion color
  //#region stamina

  readonly staminaMax: number = 100;
  stamina = this.staminaMax;

  //#endregion stamina
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

  /**
   * Player states
   */
  static readonly PLAYER_STATES = {
    IDLE: new PlayerState("idle", BaseStateClass.BASE_STATES.FREE, 0, 0),
    DOWNED: new PlayerState("downed", BaseStateClass.BASE_STATES.FREE, 0, 0),
    COMBAT: new PlayerState("combat", BaseStateClass.BASE_STATES.FREE, 0, 0),
    EXHAUSTED: new PlayerState("exhausted", BaseStateClass.BASE_STATES.FREE, 0, 0),
  };

  //#endregion states

  // protected preUpdate(time: number, delta: number): void {
  //   this.anims.update(time, delta);
  // }

  update(time: number, delta: number): void {
    super.update(time, delta);

    if (this.playerInput?.D.isDown) {
      this.setX(this.x + 1);
    }
  }
}
