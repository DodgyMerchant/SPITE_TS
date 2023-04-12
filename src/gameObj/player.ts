import { MyGameManager as MGM } from "../main";
import { WorldObject } from "./abstract/abstract";

interface int_STATES {
  [i: string]: int_STATE;
}

interface int_STATE {
  /**
   * Stamina recovery amount.
   */
  staminaRecovery: number;
  /**
   * Stamina recovery time.
   */
  staminaTime: number;
}

const PLAYER_STATES: int_STATES = {
  idle: {
    staminaRecovery: 0,
    staminaTime: 0,
  },
  downed: {
    staminaRecovery: 0,
    staminaTime: 0,
  },
  combat: {
    staminaRecovery: 0,
    staminaTime: 0,
  },
  exhausted: {
    staminaRecovery: 0,
    staminaTime: 0,
  },
};

/**
 * player Object class
 */
export class Player extends WorldObject {
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

  /**
   * create a PLayer Object.
   * @param scene — The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x — The horizontal position of this Game Object in the world.
   * @param y — The vertical position of this Game Object in the world.
   * @param texture — The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame — An optional frame from the Texture this Game Object is rendering with.
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    super(scene, x, y, texture, frame);

    //red tint
    this.setTint(this.ColorDefault);

    /** keyboard input keys */
    // this.input_Keyboard = this.scene.input.keyboard.addKeys({
    //   up: Phaser.Input.Keyboard.KeyCodes.W,
    //   down: Phaser.Input.Keyboard.KeyCodes.S,
    //   left: Phaser.Input.Keyboard.KeyCodes.A,
    //   right: Phaser.Input.Keyboard.KeyCodes.D,
    //   jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    // });

    // this.player.play("an_player_idle_idle");
  }

  protected preUpdate(time: number, delta: number): void {
    // console.log("Player pre update");

    //updates internal animations???????????????
    this.anims.update(time, delta);
  }

  update(time: number, delta: number): void {
    // console.log("Player update");
    // console.log(time, delta);
  }
}
