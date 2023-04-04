/**
 * Debug Obj
 */
type Debug = {
  debugTextObj: Phaser.GameObjects.Text | undefined;
  debugText: string[];
  key: Phaser.Input.Keyboard.Key | undefined;
  /**
   */
  /**
   * Sets text to text Object.
   * @param clear if the array should be cleared after printing.
   */
  Print(clear: boolean): void;
  /**
   * add text
   * @param texts lines of text to add as a string array
   */
  Add(texts: string[]): void;

  /**
   * inits the debug system
   * @param scene
   */
  Init(scene: Phaser.Scene): void;
};

export abstract class sc_MyScene extends Phaser.Scene {
  /**
   * group for all object to be updated
   */
  GroupAlive: Phaser.GameObjects.Group | undefined;

  //#region debug

  readonly DEBUG: Debug = {
    debugTextObj: undefined,
    debugText: [],
    key: undefined,
    Print(clear) {
      let mc = this.debugTextObj?.scene.cameras.main;

      this.debugTextObj?.setText(this.debugText);
      if (mc) this.debugTextObj?.setPosition(mc.scrollX + 2, mc.scrollY + 2);

      //delete all text from array
      if (clear) this.debugText.splice(0);
    },
    Add(texts) {
      this.debugText.push(...texts);
    },
    Init(scene) {
      this.debugTextObj = scene.add.text(2, 2, "DEBUG TEXT", { font: "12px Courier", color: "#00ff00" });
      this.key = scene.input.keyboard.addKey("J", true, false);
    },
  };

  //#endregion debug

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    config.cameras = {
      name: "MyMainCam",
      x: 0,
      y: 0,
      width: 800,
      height: 800,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: "#000000",
      rotation: 0,
      roundPixels: true,
      zoom: 1,
    };
    super(config);
  }

  init() {}

  preload() {}

  create() {
    console.log("Scene Changed To: ", this.scene.key);

    this.GroupAlive = this.add.group({
      name: "GroupAlive",
      active: true,
      runChildUpdate: true,
    });

    //#region debug

    this.DEBUG.Init(this);

    //#endregion debug
  }

  update(time: number, delta: number): void {
    //#region debug
    var pointer = this.input.activePointer;

    this.DEBUG.Add([
      "Mouse/////////////",
      "x: " + pointer.x,
      "y: " + pointer.y,
      // "mid x: " + pointer.midPoint.x,
      // "mid y: " + pointer.midPoint.y,
      // "velocity x: " + pointer.velocity.x,
      // "velocity y: " + pointer.velocity.y,
      // "movementX: " + pointer.movementX,
      // "movementY: " + pointer.movementY,
      "Scene////////////",
      "name: " + this.scene.key,
      "visible: " + this.scene.isVisible(this),
      "Camera main////////////",
      "visible: " + this.cameras.main.visible,
      "transparent: " + this.cameras.main.transparent,
      "port x/y: " + this.cameras.main.x + "/" + this.cameras.main.y,
      "port w/h: " + this.cameras.main.width + "/" + this.cameras.main.height,
      "view x/y: " + this.cameras.main.scrollX + "/" + this.cameras.main.scrollY,
      "view w/h: " + this.cameras.main.displayWidth + "/" + this.cameras.main.displayHeight,
      "center x/y: " + this.cameras.main.centerX + "/" + this.cameras.main.centerY,
    ]);

    this.DEBUG.Print(true);

    if (this.DEBUG.key?.isDown) {
      console.log("getCamerasBelowPointer: ", this.cameras.getCamerasBelowPointer(this.input.activePointer));
    }

    //#endregion debug
  }
}
