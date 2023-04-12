import { GameManager, MyGameManager as MGM } from "../../main";
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

    let mainCam = this.cameras.main;
    let mgmCv = MGM.Camera.View;

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
      "delta: " + delta.toFixed(2),
      "Camera main////////////",
      "visible: " + mainCam.visible,
      "transparent: " + mainCam.transparent,
      "",
      "// port //",
      "x/y: " + mainCam.x + "/" + mainCam.y,
      "w/h: " + mainCam.width + "/" + mainCam.height,
      "cent x/y: " + mainCam.centerX + "/" + mainCam.centerY,
      "",
      "// view no zoom //",
      "x/y: " + mainCam.scrollX + "/" + mainCam.scrollY,
      "w/h: " + mainCam.width + "/" + mainCam.height,
      "cen x/y: " + mainCam.worldView.centerX + "/" + mainCam.worldView.centerY,
      "",
      "// view + zoom //",
      "x/y: " + mgmCv.GetX(mainCam) + "/" + mgmCv.GetY(mainCam),
      "w/h: " + mgmCv.GetWidth(mainCam) + "/" + mgmCv.GetHeight(mainCam),
      "off w/h: " + mgmCv.GetZoomOffsetX(mainCam) + "/" + mgmCv.GetZoomOffsetY(mainCam),
    ]);

    //#endregion debug
  }
}
