import { PBIClass } from "./abstract/PBI";
import { BaseState, BaseStateClass } from "../myUtils/baseStates";
import { ComplexState, StateClass } from "../myUtils/states";
import MyMath from "../myUtils/MyMath";
import { sc_MyScene } from "../scenes/abstract/sc_MyScene";
import { gameManager } from "../main";

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

    player.StaminaSet(this.staminaRecovery, this.staminaTime);
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
    scene: sc_MyScene,
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

    /** keyboard input keys */
    let keyb = this.scene.input.keyboard;
    if (keyb)
      this.playerInput = {
        W: keyb.addKey("W"),
        A: keyb.addKey("A"),
        S: keyb.addKey("S"),
        D: keyb.addKey("D"),
      };

    // this.scene.game.
  }

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

  /**
   * Player states
   */
  static readonly PLAYER_STATES = {
    IDLE: new PlayerState("idle", BaseStateClass.BASE_STATES.FREE, 1, 60 * 1),
    DOWNED: new PlayerState("downed", BaseStateClass.BASE_STATES.FREE, 0, 0),
    COMBAT: new PlayerState("combat", BaseStateClass.BASE_STATES.FREE, 0, 0),
    EXHAUSTED: new PlayerState("exhausted", BaseStateClass.BASE_STATES.FREE, 0, 0),
  };

  //#endregion states
  //#region stamina

  readonly stamMax: number = 100;
  stamina = this.stamMax;

  /**
   * if the stamina system is enabled.
   * If disabled all stamina is practiacally infinite.
   */
  private _staminaEnabled = true;
  /**
   * if the stamina system is enabled.
   * If disabled all stamina is practiacally infinite.
   */
  public get staminaEnabled() {
    return this._staminaEnabled;
  }
  public set staminaEnabled(bool) {
    this._staminaEnabled = bool;
  }

  /**
   * if the stamina is empty.
   * OR stamina system is disabled.
   */
  public get staminaEmpty() {
    return this.stamina == 0 && this._staminaEnabled;
  }

  /**
   * if stamina has be reduced this frame.
   * Will only restart the stamina recovery cooldown if the dtamina is actually recovering not draining..
   */
  _stamHit = false;

  /**
   * !!SYSTEM INTERNAL!!
   *
   * Stamina value added to current stamina  onece per frame.
   *
   * Negative to subtract.
   *
   * use "StaminaSet" tu set
   */
  _stamTick = 0;
  /**
   * !!SYSTEM INTERNAL!!
   *
   * Time in frames until the
   *
   * 0 immediately starts recovering.
   *
   * use "StaminaSet" tu set
   */
  _stamTime = 0;
  /**
   * !!SYSTEM INTERNAL!!
   *
   * counter for _stamTime
   */
  _stamTimeCount = 0;

  /**
   * set an overtime applied value
   * Negative tick subtracts value and drains the stamina.
   * @param tick value to add/subtract from stamina.
   * @param time time untill the stamina tick will take effect.
   */
  StaminaSet(tick: number, time: number): void {
    this._stamTick = tick;
    this._stamTime = time;
    this._stamTimeCount = time;
  }

  /**
   * chnages the tick value of the stamina system.
   * doesnt do anything else.
   * @param value
   */
  StaminaSetTick(value: number) {
    this._stamTick = value;
  }

  /**
   * a one time stamina application.
   * if value is negative will subtract from the stamina and
   * @param value value to affect the stamina by.
   */
  StaminaHit(value: number) {
    this._StaminaApply(value, true);
  }

  /**
   * Stamina immediately starts recovering
   */
  StaminaStartRecovery() {
    this._stamTime = 0;
  }

  /**
   * !!SYSTEM INTERNAL!!
   *
   * add/subtract value from stamina.
   *
   * clamps stamina value between 0 and maximum.
   *
   * @param value value to add/subtract.
   * @param hit if stamina application triggers recovery cooldown. default false.
   */
  _StaminaApply(value: number, hit = false) {
    if (hit && value < 0) {
      this._stamHit = true;
    }
    this.stamina = MyMath.clamp(this.stamina + value, 0, this.stamMax);
  }

  /**
   * The stamina systems update method.
   */
  StaminaUpdate(time: number, delta: number) {
    let _fm = this.FixedMult(delta);
    if (this._stamTick != 0) {
      //if stamina was hit (resets stamina time) and tick is positive (stamina is recovering)
      if (this._stamHit) {
        //reset cooldown
        this._stamTimeCount = this._stamTime;

        //disable hit
        this._stamHit = false;
      }

      if (this._stamTimeCount <= 0) {
        //adding/subtracting stamina
        // this._StaminaApply(this._stamTick);
        this._StaminaApply(this._stamTick * _fm);
      } else {
        // this._stamTimeCount -= 1;
        this._stamTimeCount -= 1 * _fm;
      }
    }

    //DEBUG
    if (this.DEBUG.enabled) {
      let grap = this.DEBUG.gameGraph;

      if (grap) {
        let lw = 0.3;
        let a = 0.5;
        let c = 0x00ff00;
        let w = 20;
        let h = 2;
        let bc = this.getBottomCenter();

        if (bc.x != undefined && bc.y != undefined) {
          let rect = new Phaser.Geom.Rectangle(bc.x - w * 0.5, bc.y + 1, 20, h);

          rect.width = w * (this.stamina / this.stamMax);

          grap.fillStyle(c, a);
          grap.fillRectShape(rect);

          rect.width = w;

          grap.lineStyle(lw, c, a);
          grap.strokeRectShape(rect);
        }
      }
    }
  }

  //#endregion stamina

  // protected preUpdate(time: number, delta: number): void {
  //   this.anims.update(time, delta);
  // }

  update(time: number, delta: number): void {
    super.update(time, delta);

    let _fm = this.FixedMult(delta);

    //stamina
    this.StaminaUpdate(time, delta);

    if (this.playerInput?.D.isDown) {
      this.setX(this.x + 1 * _fm);
    }
    if (this.playerInput?.A.isDown) {
      this.setX(this.x - 1 * _fm);
    }
    if (this.playerInput?.W.isDown) {
      this.StaminaHit(-this.stamMax);
    }

    // console.log("delta: ", delta.toFixed(2));
  }
}
