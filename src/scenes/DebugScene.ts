import { SPITEManager as GM } from "../main";
import sc_Hud from "./abstract/sc_HUD";

export type DebugActivated = {
  /**
   * debugging scnee to use.
   */
  DEBUG: DebugScene;
};

/**
 * Debug Scene.
 * handles debug scene for displaying.
 */
export class DebugScene extends sc_Hud {
  /**
   * if debug is enabled
   */
  private _enabled = false;
  public get enabled() {
    return this._enabled;
  }
  public set enabled(bool) {
    this._enabled = bool;

    if (this.textObj) {
      this.textObj.visible = bool;
    }
    if (this.gameGraph) {
      this.gameGraph.visible = bool;
    }

    if (!bool) {
    }
  }

  /**
   * targeted scene for debug functions.
   */
  targetScene: Phaser.Scene | undefined;
  textObj: Phaser.GameObjects.Text | undefined;
  displayText = new Array<string>();
  inputkeys: { activate: Phaser.Input.Keyboard.Key } | undefined = undefined;
  /** graphics in game scene */
  gameGraph: Phaser.GameObjects.Graphics | undefined;
  /**
   * scene key
   */
  key: string = "DEBUG_SCENE";

  constructor(x: number, y: number, width: number, height: number, zoom: number) {
    super("DEBUG_SCENE", "DEBUG_CAM", x, y, width, height, zoom);
  }

  init() {}

  preload() {}

  create() {
    super.create();

    this.enabled = true;

    this.textObj = this.add.text(0, 0, "DEBUG", { color: "#00ff00", font: "16px Courier" });

    //keyboard keys and events
    if (this.input.keyboard) {
      this.inputkeys = { activate: this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.J, true, false) };

      let keybEvCall: MyPhaserTypes.Input.Keyboard.KeyEventCallback = () => {
        this.enabled = !this.enabled;
        console.log("debug -> ", this.enabled);
      };

      this.inputkeys.activate.addListener(Phaser.Input.Keyboard.Events.DOWN, keybEvCall);
    }

    this.gameGraph = this.add.graphics({
      x: 0,
      y: 0,
      fillStyle: { color: 0xff0000, alpha: 1.0 },
      lineStyle: { color: 0xff0000, alpha: 1.0, width: 1 },
    });
    this.targetScene = this;
  }

  update(): void {
    if (this.enabled) {
      super.update();

      this.Print();

      if (this.targetScene && this.gameGraph && this.targetScene != this) {
        if (this.gameGraph.scene != undefined) {
          //move game graph to top if it isnt in top position.
          if (!GM.GmObj.Order.isTop(this.gameGraph)) this.targetScene.children.bringToTop(this.gameGraph);
        }

        this.gameGraph.clear();
        this.AddText(["FPS: " + this.game.loop.actualFps]);
      }
    }
  }

  //////////////////////////////////////////////////////////////

  /**
   * print text  in debug scene.
   * @param clear if the array should be cleared after printing.
   */
  Print(clear: boolean = true): void {
    let offx = 2;
    let offy = 2;
    let mc = this.textObj?.scene.cameras.main;

    this.textObj?.setText(this.displayText);

    if (mc) this.textObj?.setPosition(mc.worldView.x + offx, mc.worldView.y + offy);

    //delete all text from array
    if (clear) this.displayText.splice(0);
  }

  /**
   * Sets text to text Object
   * @param texts lines of text to add as a string array
   */
  AddText(texts: string[]): void {
    this.displayText.push(...texts);
  }

  /**
   * targets a scene for debugging.
   * Moves debugging objects and features to the scene and initializes stuff.
   * @param scene scene to move to
   */
  TargetScene(scene: Phaser.Scene) {
    if (this.targetScene && this.gameGraph) {
      //game graph
      GM.GmObj.Move.Move(this.targetScene, scene, this.gameGraph);
      this.gameGraph.setVisible(true);
      this.gameGraph.setActive(true);

      this.targetScene = scene;
    } else console.error("DEBUG obj bad initililization or not done", this.targetScene);
  }
}
