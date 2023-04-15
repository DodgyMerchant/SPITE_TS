/**
 * My custom phasertypes
 */
declare namespace MyPhaserTypes {
  /**
   * animation stuff
   */
  namespace Animation {
    /**
     * Animation callback.
     * Used for event types:
     * @see Phaser.Animations.Events.ANIMATION_COMPLETE
     * @see Phaser.Animations.Events.ANIMATION_COMPLETE_KEY
     * @see Phaser.Animations.Events.ANIMATION_REPEAT
     * @see Phaser.Animations.Events.ANIMATION_RESTART
     * @see Phaser.Animations.Events.ANIMATION_START
     * @see Phaser.Animations.Events.ANIMATION_STOP
     * @see Phaser.Animations.Events.ANIMATION_UPDATE
     *
     * @param animation A reference to the Animation that has updated.
     * @param frame The current Animation Frame of the Animation.
     * @param gameObject A reference to the Game Object on which the animation updated.
     * @param frameKey The unique key of the Animation Frame within the Animation.
     */
    function GeneralCallback(
      animation: Phaser.Animations.Animation,
      frame: Phaser.Animations.AnimationFrame,
      gameObject: Phaser.GameObjects.Sprite,
      frameKey: string
    ): void;

    /**
     * Animation callback used on adding or removing an animation from the global animation manager.
     * Used for event types:
     * @see Phaser.Animations.Events.ADD_ANIMATION
     * @see Phaser.Animations.Events.REMOVE_ANIMATION
     *
     * @param key The key of the Animation that was removed from the global Animation Manager.
     * @param animation An instance of the removed Animation.
     */
    function AddRemoveCallback(key: string, animation: Phaser.Animations.Animation): void;

    /**
     * This event is dispatched when the global Animation Manager pauses or resumes playback, having been previously paused or playing.
     * Used for event types:
     * @see Phaser.Animations.Events.PAUSE_ALL
     * @see Phaser.Animations.Events.RESUME_ALL
     *
     */
    function PauseResumeCallback(): void;
  }
}
