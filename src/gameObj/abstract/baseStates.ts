import { StateMovement } from "./stateMovement";

/**
 * input states
 */
export abstract class BaseStates extends StateMovement {
  /**
   * vector to be used and thrown away for calculations
   * dont save stuff in it
   * alsways reset before using
   * @type {Phaser.Math.Vector2} type
   */
  workVec: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  /**
   * states for the object
   */
  static readonly STATES = {
    /**
     * obj is free to move.
     */
    FREE: {
      name: "free",
      toString() {
        name;
      },
    },
    /**
     * obj input is disabled.
     * But movement isnt cancelled.
     */
    STUNNED: "stunned",
    /**
     * obj is controlled by scene.
     * Input is blocked but movement isnt frozen.
     */
    CONTROLLED: "controlled",
    /**
     * obj is frozen.
     * Input and movement is disallowed.
     */
    FROZEN: "frozen",
  };

  /**
   *
   *
   * @param scene — The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x — The horizontal position of this Game Object in the world.
   * @param y — The vertical position of this Game Object in the world.
   * @param texture — The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame — An optional frame from the Texture this Game Object is rendering with.
   * @param movementConfig MovementConfig object
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number | undefined
  ) {
    super(scene, x, y, texture, frame);

    this.stateSwitch(movementConfig.state);
  }

  /**
   * switchtches object to given state including changes depending on the state.
   *
   * @param {string} str STATE state string. f.e. STATES.FREE
   */
  stateSwitch(stateString: string | number) {
    switch (stateString) {
      case STATES.FREE:
        this.moveCanMoveSet(true);
        this.moveFrozenSet(false);
        break;
      case STATES.STUNNED:
        this.moveCanMoveSet(false);
        this.moveFrozenSet(false);
        break;
      case STATES.CONTROLLED:
        this.moveCanMoveSet(false);
        this.moveFrozenSet(false);
        break;
      case STATES.FROZEN:
        this.moveCanMoveSet(false);
        this.moveFrozenSet(true);
        break;
      default:
        console.error("///// Unknown state in: " + this.name + "!!!");
        return;
    }

    this.setState(stateString);
  }

  /**
   * returns the current objects state as a string
   * from STATES enum-like
   * @returns {string} state as a string
   */
  stateGet(): string {
    return this.state.toString();
  }

  /**
   * runs continuously
   * moves obj
   */
  stateUpdate() {
    if (this.moveCanMoveGet() && this.inputCheck(inputVec) && this.moveInputMethod) {
      // let _x = this.workVec.x;
      // let _y = this.workVec.y;
      let _spd = this.moveGetSpeed();

      //applying movement speed
      this.workVec.scale(_spd);

      //apply movmeent
      super.phyMoveAdd(this.workVec);
      // this.thrust(this.workVec.length()); does the same thing
    }
  }
}

