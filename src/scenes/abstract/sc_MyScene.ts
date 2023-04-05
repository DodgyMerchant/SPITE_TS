import { GameManager } from "../../main";
import { DebugScene } from "./DebugScene";

/**
 * Abstract game scene.
 */
export abstract class sc_MyScene extends Phaser.Scene {
  /**
   * group for all object to be updated
   */
  GroupAlive: Phaser.GameObjects.Group | undefined;

  //#region debug

  DEBUG: DebugScene;

  //#endregion debug

  constructor(config: Phaser.Types.Scenes.SettingsConfig, manager: GameManager) {
    config.cameras = {
      name: "MyMainCam",
      x: 0,
      y: 0,
      width: manager.Scales.PortWidth,
      height: manager.Scales.PortHeight,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: "#000000",
      rotation: 0,
      roundPixels: true,
      zoom: 8,
    };
    super(config);

    this.DEBUG = manager.DebugScene;
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

    //debug
    //bring debug scene to top
    this.scene.bringToTop(this.DEBUG.key);

    this.DEBUG.TargetScene(this);

    // console.log(this.events.eventNames());
  }

  update(time: number, delta: number): void {
    //#region debug
    var pointer = this.input.activePointer;

    this.DEBUG?.AddText([
      "Mouse/////////////",
      "x: " + pointer.x,
      "y: " + pointer.y,
      // "mid x: " + pointer.midPoint.x,
      // "mid y: " + pointer.midPoint.y,
      // "velocity x: " + pointer.velocity.x,
      // "velocity y: " + pointer.velocity.y,
      // "movementX: " + pointer.movementX,
      // "movementY: " + pointer.movementY,
      "",
      "Scene////////////",
      "name: " + this.scene.key,
      "visible: " + this.scene.isVisible(this),
      "",
      "Camera main////////////",
      "visible: " + this.cameras.main.visible,
      "transparent: " + this.cameras.main.transparent,
      "port x/y: " + this.cameras.main.x + "/" + this.cameras.main.y,
      "port w/h: " + this.cameras.main.width + "/" + this.cameras.main.height,
      "port Disp w/h: " + this.cameras.main.displayWidth + "/" + this.cameras.main.displayHeight,
      "view x/y: " + this.cameras.main.worldView.x + "/" + this.cameras.main.worldView.y,
      "view w/h: " + this.cameras.main.worldView.width + "/" + this.cameras.main.worldView.height,
      "center x/y: " + this.cameras.main.worldView.centerX + "/" + this.cameras.main.worldView.centerY,
    ]);

    if (this.DEBUG.inputkey?.isDown) {
      console.log("getCamerasBelowPointer: ", this.cameras.getCamerasBelowPointer(this.input.activePointer));
    }

    //#endregion debug
  }
}
