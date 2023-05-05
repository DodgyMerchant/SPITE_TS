import { PBIClass } from "./abstract/PBI";
import { BaseState } from "../myUtils/baseStates";
import {
  ActiveComplexState,
  MultiStateInterface,
  NestedStateInterface,
  RootStateInterface,
  StateClass,
  StateMultiClass,
} from "../myUtils/states";
import MyMath from "../myUtils/MyMath";
import { sc_MyScene } from "../scenes/abstract/sc_MyScene";
import { MyInputBundle, MyKeyboardInput } from "../scenes/gameScenes/sc_Game";
import { gameManager } from "../main";

//#region player multi state

/**
 * function run every step.
 * @param nextState next state up the chain. THIS state the function is belongs to.
 * @param fm fixed multipler to counter frame time difference.
 * @param time
 * @param delta delta time in ms.
 */
type StateUpdateFunc = (nextState: PlayerState, fm: number, time: number, delta: number) => void;

/**
 * function run once on change to (apply) or from (undo) this stare.
 * @param player Player Object
 */
type StateApplyFunc = (nextState: PlayerState) => void;

type PlayerStateLeafConf = {
  /*
  key: ,
  name: ,
  baseState: ,
  staminaRecovery: ,
  staminaTime: ,
  stateUpdate: ,
  stateApply?: ,
  stateUndo?: ,
  */
  /**
   *
   */
  key: string;
  /**
   * name of the state.
   */
  name: string;
  /**
   * Base State applied on chant to this state.
   */
  baseState: BaseState;
  /**
   * Stamina recovery amount.
   */
  staminaRecovery: number;
  /**
   * Stamina recovery time.
   */
  staminaTime: number;
  /**
   * update run every frame.
   */
  stateUpdate: StateUpdateFunc;
  /**
   * name of the state.
   */
  stateApply?: StateApplyFunc;
  /**
   * name of the state.
   */
  stateUndo?: StateApplyFunc;
};

/**
 * Player complex substate for player state machine.
 */
class PlayerStateLeaf extends StateClass implements NestedStateInterface<string, PlayerStateBranch>, ActiveComplexState {
  /**
   *
   * @param name name of the state.
   * @param baseState Base State applied on chant to this state.
   * @param staminaRecovery Stamina recovery amount.
   * @param staminaTime Stamina recovery time.
   * @param stateUpdate function run every frame.
   * @param stateApply function run on change to this state.
   * @param stateUndo function run on switch from this state to another.
   */
  constructor(
    name: string,
    baseState: BaseState,
    staminaRecovery: number,
    staminaTime: number,
    stateUpdate: StateUpdateFunc,
    stateApply?: StateApplyFunc,
    stateUndo?: StateApplyFunc
  ) {
    super(name);
    this.baseState = baseState;
    this.staminaRecovery = staminaRecovery;
    this.staminaTime = staminaTime;

    this.stateUpdate = stateUpdate;
    this.stateApply = stateApply;
    this.stateUndo = stateUndo;
  }
  parent: PlayerStateBranch | undefined;

  /**
   * function run every step.
   */
  stateUpdate: StateUpdateFunc;
  /**
   * function run once on change to (apply) or from (undo) this stare.
   */
  stateApply: StateApplyFunc | undefined;
  /**
   * function run once on change to (apply) or from (undo) this stare.
   */
  stateUndo: StateApplyFunc | undefined;

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

    if (this.stateApply) this.stateApply(this);
  }
  undo(_player: Player): void {
    if (this.stateUndo) this.stateUndo(this);
  }
}

type PlayerStateBranchConf = {
  /*
  key: ,
  name: ,
  stateInit: ,
  stateMap: ,
  stateUpdate: ,
  */
  key: string;
  name: string;
  stateInit: string;
  stateList: (PlayerStateLeafConf | PlayerStateBranchConf)[];
  stateUpdate: StateUpdateFunc | undefined;
};

/**
 * Complex State with complex substates.
 * Must have atleast one substate.
 */
class PlayerStateBranch
  extends StateMultiClass<PlayerState>
  implements NestedStateInterface<string, MultiStateInterface<string>>, MultiStateInterface<string>
{
  /**
   *
   * if you specify a custom update method:
   * DO NOT FORGET to call the substates stateUpdate with "this.StateGet().stateUpdate(player, fm, time, delta);"
   * @param name name
   * @param stateInit
   * @param stateList
   * @param stateUpdate function run every frame. Defaults to an empty method that only calls the substates update. DO NOT FORGET to call the substates stateUpdate with "let state = this.StateGet(); state.stateUpdate(state, fm, time, delta);"
   */
  constructor(
    name: string,
    stateInit: string,
    stateList: (PlayerStateLeafConf | PlayerStateBranchConf)[],
    stateUpdate: StateUpdateFunc = (_nextState: PlayerState, fm: number, time: number, delta: number) => {
      let state = this.StateGet();
      state.stateUpdate(state, fm, time, delta);
    }
  ) {
    // super(name, stateMap.get(stateInit) ?? new PlayerStateLeaf("ERROR", Player.BASE_STATES.FROZEN, 0, 0, () => {}));

    let stateMap = new Map<string, PlayerState>();
    let confLeafCheck = function (conf: PlayerStateLeafConf | PlayerStateBranchConf): conf is PlayerStateLeafConf {
      return (<PlayerStateLeafConf>conf).baseState !== undefined;
    };
    let conf;
    for (let i = 0; i < stateList.length; i++) {
      conf = stateList[i];

      if (confLeafCheck(conf)) {
        //is Leaf

        stateMap.set(
          conf.key,
          new PlayerStateLeaf(
            conf.name,
            conf.baseState,
            conf.staminaRecovery,
            conf.staminaTime,
            conf.stateUpdate,
            conf.stateApply,
            conf.stateUndo
          )
        );
      } else {
        //is branch
        stateMap.set(conf.key, new PlayerStateBranch(conf.name, conf.stateInit, conf.stateList, conf.stateUpdate));
      }
    }

    //get default state
    let s = stateMap.get(stateInit);
    //error if default state isnt found in state map.
    if (s) super(name, s);
    else throw new Error("nothing found in state map!");

    //add parent refrence after "this" exists.
    stateMap.forEach((state) => {
      state.parent = this;
    });

    this.stateMap = stateMap;

    this.stateUpdate = stateUpdate;
  }
  stateMap: Map<string, PlayerState>;
  stateApply: StateUpdateFunc | undefined;
  stateUndo: StateUpdateFunc | undefined;
  stateUpdate: StateUpdateFunc;

  MultiStateSwitch(player: Player, fromState: string, toState: string): boolean {
    console.log(this);
    if (this.stateMap.has(fromState)) {
      let state = this.stateMap.get(toState);

      if (state) {
        this.StateSet(player, state);
        return true;
      }
    }
    //doesnt have from or from and to state.
    if (this.parent) {
      return this.parent.MultiStateSwitch(player, fromState, toState);
    }

    return false;
  }

  parent: PlayerStateBranch | Player | undefined;
}

type PlayerState = PlayerStateBranch | PlayerStateLeaf;

//#endregion player multi state
//#region input

export class PlayerInput implements MyKeyboardInput {
  constructor(keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
    this.keyboard = keyboard;

    this.UP = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.UP]);
    this.DOWN = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.DOWN]);
    this.LEFT = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.LEFT]);
    this.RIGHT = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.D, Phaser.Input.Keyboard.KeyCodes.RIGHT]);
    this.RUN = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.SHIFT, Phaser.Input.Keyboard.KeyCodes.ALT]);

    //combat
    ////attack
    this.READY = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.K]);
    this.SLASH = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.L]);

    ////brace
    this.BRACE = new MyInputBundle(keyboard, [Phaser.Input.Keyboard.KeyCodes.SHIFT]);
  }

  keyboard: Phaser.Input.Keyboard.KeyboardPlugin;

  UP: MyInputBundle;
  DOWN: MyInputBundle;
  LEFT: MyInputBundle;
  RIGHT: MyInputBundle;
  RUN: MyInputBundle;

  //combat
  ////attack
  READY: MyInputBundle;
  SLASH: MyInputBundle;

  ////brace
  BRACE: MyInputBundle;
}

//#endregion input

enum PLAYER_STATES {
  IDLE = "IDLE",
  COMBAT = "COMBAT",
  DOWNED = "DOWNED",
  EXHAUSTED = "EXHAUSTED",
}

/**
 * player Object class
 */
export class Player extends PBIClass implements MultiStateInterface<string>, RootStateInterface<string> {
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
    playerInput: PlayerInput,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined,
    state: PLAYER_STATES = PLAYER_STATES.IDLE
  ) {
    super(scene, x, y, texture, frame, Player.BASE_STATES.FREE, (vec2: Phaser.Math.Vector2) => {
      vec2
        .set(+this.pInput.RIGHT.isDown - +this.pInput.LEFT.isDown, +this.pInput.DOWN.isDown - +this.pInput.UP.isDown)
        .normalize()
        .scale(this.moveSpeed);

      return vec2;
    });

    this.pInput = playerInput;

    //red tint
    this.setTint(this.ColorDefault);

    //state
    // this._playerState = this.STATES.get(state);

    //get default state
    let s = this.stateMap.get(state);
    //error if default state isnt found in state map.
    if (s) this._playerState = s;
    else throw new Error("nothing found in state map!");

    this.playerState = s;

    // this.scene.game.
  }

  //#region input

  /**
   * player input
   */
  pInput: PlayerInput;

  //#endregion input
  //#region color

  /**
   * Default tint color, red.
   */
  readonly ColorDefault: number = Phaser.Display.Color.GetColor(144, 11, 9);

  //#endregion color
  //#region speed

  moveSpeed = 0;

  //#endregion speed
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
    return this.stamina <= 0 && this._staminaEnabled;
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
  StaminaUpdate(_time: number, delta: number) {
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
  //#region states

  MultiStateSwitch(_player: object, fromState: string, toState: string): boolean {
    if (this.stateMap.has(fromState)) {
      let state = this.stateMap.get(toState);

      if (state) {
        this.playerState = state;
        return true;
      }
    }

    console.error("Player State Switch: State Not found! from: ", fromState, " toState: ", toState);
    return false;
  }

  parent: undefined = undefined;

  /**
   * complex nested player state
   */
  private _playerState: PlayerState;
  /**
   * complex nested player state
   */
  public get playerState(): PlayerState {
    return this._playerState;
  }
  public set playerState(state: PlayerState) {
    this._playerState.undo(this);
    this._playerState = state;
    state.parent = this;
    this._playerState.apply(this);
  }

  /**
   * Player states
   */
  stateMap = new Map<string, PlayerState>([
    //IDLE
    [
      PLAYER_STATES.IDLE,
      new PlayerStateBranch("IDLE", "idle", [
        //idle idle
        {
          key: "idle",
          name: "idle",
          baseState: Player.BASE_STATES.FREE,
          staminaRecovery: 1,
          staminaTime: gameManager.FPS_Target * 1,
          stateUpdate: (state: PlayerState, _fm: number) => {
            //run input switch to run state
            if (this.pInput.RUN.isDown) {
              state.parent?.MultiStateSwitch(this, "idle", "run");
            }
          },
          stateApply: (_state: PlayerState) => {
            this.play("an_player_idle_idle");
            this.moveSpeed = 0.1;
          },
        },
        //idle run
        {
          key: "run",
          name: "run",
          baseState: Player.BASE_STATES.FREE,
          staminaRecovery: -(this.stamMax / (gameManager.FPS_Target * 3)),
          staminaTime: 0,
          stateUpdate: (state: PlayerState, _fm: number) => {
            if (this.pInput.RUN.isUp) {
              state.parent?.MultiStateSwitch(this, "run", "idle");
            }
            if (this.staminaEmpty) {
              state.parent?.MultiStateSwitch(this, PLAYER_STATES.IDLE, PLAYER_STATES.EXHAUSTED);
            }
          },
          stateApply: (_state: PlayerState) => {
            this.moveSpeed = 0.25;
          },
        },
      ]),
    ],
    //EXHAUSTED
    [
      PLAYER_STATES.EXHAUSTED,
      new PlayerStateLeaf(
        "exhausted",
        Player.BASE_STATES.FROZEN,

        this.stamMax / (gameManager.FPS_Target * 5),
        0,
        (state) => {
          if (this.stamina == this.stamMax) state.parent?.MultiStateSwitch(this, PLAYER_STATES.EXHAUSTED, PLAYER_STATES.IDLE);
        }
      ),
    ],
  ]);

  //#endregion states

  // protected preUpdate(time: number, delta: number): void {
  //   this.anims.update(time, delta);
  // }

  update(time: number, delta: number): void {
    super.update(time, delta);

    //stamina
    this.StaminaUpdate(time, delta);

    // this._playerState.stateUpdate(this, this.FixedMult(delta), time, delta);
    // console.log(this._playerState.name);
    this._playerState.stateUpdate(this._playerState, this.FixedMult(delta), time, delta);

    // console.log("delta: ", delta.toFixed(2));
  }
}
