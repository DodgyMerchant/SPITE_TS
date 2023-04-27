import { BaseState, BaseStateClass } from "../../myUtils/baseStates";
import { InputFunction } from "../../myUtils/stateMoveInput";
import { sc_MyScene } from "../../scenes/abstract/sc_MyScene";

/*
 * The animation event flow is as follows:
 *
 * ANIMATION_START
 * ANIMATION_UPDATE       (repeated for however many frames the animation has)
 * ANIMATION_REPEAT       (only if the animation is set to repeat, it then emits more update events after this)
 * ANIMATION_COMPLETE     (only if there is a finite, or zero, repeat count)
 * ANIMATION_COMPLETE_KEY (only if there is a finite, or zero, repeat count)
 *
 * If the animation is stopped directly, the ANIMATION_STOP event is dispatched instead of ANIMATION_COMPLETE.
 *
 * If the animation is restarted while it is already playing, ANIMATION_RESTART is emitted.
 */

export type PBI_List = Array<number>;

export class PBIClass extends BaseStateClass {
  /**
   *
   * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x The horizontal position of this Game Object in the world.
   * @param y The vertical position of this Game Object in the world.
   * @param texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame An optional frame from the Texture this Game Object is rendering with.
   * @param state object base state. default FREE.
   * @param inputMeth Method called to get input for movement.
   */
  constructor(
    scene: sc_MyScene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame: string | number | undefined,
    state: BaseState = BaseStateClass.BASE_STATES.FREE,
    inputMeth?: InputFunction
  ) {
    super(scene, x, y, texture, frame, state, inputMeth);

    let call: MyPhaserTypes.Animation.GeneralCallback = (
      anim: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame,
      gameObject: Phaser.GameObjects.Sprite,
      frameKey: String
    ) => {
      // console.log("complete", anim, frame, gameObject, frameKey);
      console.log("anim event key: ", frameKey);

      // this.chain(["an_player_attack_ready", "an_player_attack_slash"]);
    };

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "an_player_attack_slash", call);
  }

  protected preUpdate(time: number, delta: number): void {
    // console.log("Player pre update");
    /**
     * AVOID animation progrss methods and variables.
     * they dont work.
     * setProgress +
     */
    // time
    // let frame = this._animGetFrame(0);
    // if (frame) this.anims.setCurrentFrame(frame);

    super.preUpdate(time, delta);
  }
}

export type PBIManager = {
  /**
   * set PBI entry for a key.
   *
   * undefined if no entry exists.
   * @param key
   */
  PBIget(key: string): PBI_List | undefined;
  /**
   * set PBI entry for a key
   * @param key
   * @param list
   */
  PBIset(key: string, list: PBI_List): void;
};
