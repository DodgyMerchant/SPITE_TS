import { PBIClass } from "./abstract/PBI";
import { BaseState } from "../myUtils/baseStates";
import { ComplexState, StateClass, StateMultiClass } from "../myUtils/states";
import MyMath from "../myUtils/MyMath";
import { sc_MyScene } from "../scenes/abstract/sc_MyScene";
import { DebugScene } from "../scenes/DebugScene";

type UpdateFunc =
  /**
   * @param player
   * @param fm fixed multipler to counter frame time difference.
   * @param time
   * @param delta delta time in ms.
   */
  (player: Player, fm: number, time: number, delta: number) => void;

type UpdateState = {
  /**
   * function run every step.
   */
  readonly stateUpdate: UpdateFunc;
};

/**
 * player substate for player state machine.
 */
class PlayerStateLeaf extends StateClass implements ComplexState, UpdateState {
  /**
   *
   * @param name name of the state.
   * @param recovery Stamina recovery amount.
   * @param time Stamina recovery time.
   * @param stateUpdate Stamina recovery time.
   */
  constructor(name: string, baseState: BaseState, recovery: number, time: number, stateUpdate: UpdateFunc) {
    super(name);
    this.baseState = baseState;
    this.staminaRecovery = recovery;
    this.staminaTime = time;

    this.stateUpdate = stateUpdate;
  }
  stateUpdate: UpdateFunc;

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
    player.StateSet(this.baseState);

    player.StaminaSet(this.staminaRecovery, this.staminaTime);
  }
  undo(player: Player): void {}
}

/**
 * player state for player state machine.
 */
class PlayerStateBranch extends StateMultiClass<PlayerState> implements UpdateState {
  /**
   *
   * @param name
   * @param stateInit
   * @param stateMap
   * @param stateUpdate function run every frame
   */
  constructor(
    name: string,
    stateInit: string,
    stateMap: Map<string, PlayerState>,
    stateUpdate: UpdateFunc = (player: Player, fm: number, time: number, delta: number) => {
      this.StateGet().stateUpdate(player, fm, time, delta);
    }
  ) {
    // super(name, stateMap.get(stateInit) ?? new PlayerStateLeaf("ERROR", Player.BASE_STATES.FROZEN, 0, 0, () => {}));

    let s = stateMap.get(stateInit);

    if (s) super(name, s);
    else throw new Error("nothing found in state map!");

    this.stateMap = stateMap;

    this.stateUpdate = stateUpdate;
  }

  stateMap: Map<string, PlayerState>;
  stateUpdate: UpdateFunc;
}

type PlayerState = PlayerStateLeaf | PlayerStateBranch;

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
    super(scene, x, y, texture, frame, Player.BASE_STATES.FREE);

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
    IDLE: new PlayerStateLeaf(
      "idle",
      Player.BASE_STATES.FREE,
      1,
      60 * 1,
      (player: Player, fm: number, time: number, delta: number) => {
        if (player.playerInput?.D.isDown) {
          player.setX(player.x + 1 * fm);
        }
        if (player.playerInput?.A.isDown) {
          player.setX(player.x - 1 * fm);
        }
        if (player.playerInput?.W.isDown) {
          player.StaminaHit(-player.stamMax);
        }
      }
    ),
    COMBAT: new PlayerStateBranch(
      "combat",
      "combat_idle",
      new Map<string, PlayerState>([
        [
          "combat_idle",
          new PlayerStateLeaf("free", Player.BASE_STATES.FREE, 1, 60 * 1, (player: Player, time: number, delta: number) => {}),
        ],
        [
          "combat_attack",
          new PlayerStateBranch(
            "test",
            "test1",
            new Map([
              [
                "test1",
                new PlayerStateLeaf("1", Player.BASE_STATES.FREE, 1, 60 * 1, (player: Player, time: number, delta: number) => {}),
              ],
            ])
          ),
        ],
      ])
    ),
    // DOWNED: new PlayerStateBranch("downed"),
    // EXHAUSTED: new PlayerStateBranch("exhausted"),

    /**
     * new PlayerStateBranch(
     *      "test",
     *      "test1",
     *      new Map([
     *        [
     *          "test1",
     *          new PlayerStateLeaf("1", Player.BASE_STATES.FREE, 1, 60 * 1, (player: Player, time: number, delta: number) => {}),
     *        ],
     *      ])
     *    ),
     */
  };

  //#endregion states
  //#region stamina system

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

  //#endregion stamina system

  // protected preUpdate(time: number, delta: number): void {
  //   this.anims.update(time, delta);
  // }

  update(time: number, delta: number): void {
    super.update(time, delta);

    //stamina
    this.StaminaUpdate(time, delta);

    this._playerState.stateUpdate(this, this.FixedMult(delta), time, delta);

    // console.log("delta: ", delta.toFixed(2));
  }
}
