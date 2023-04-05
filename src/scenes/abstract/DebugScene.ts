import { GameManager } from "../../main";

/**
 * Debug Scene.
 * handles debug scene for displaying.
 */
export class DebugScene extends Phaser.Scene {
  /**
   *
   */
  targetScene: Phaser.Scene | undefined;
  textObj: Phaser.GameObjects.Text | undefined;
  displayText = new Array<string>();
  inputkey: Phaser.Input.Keyboard.Key | undefined;
  /** graphics in game scene */
  gameGraph: Phaser.GameObjects.Graphics | undefined;
  /**
   * scene key
   */
  key: string = "DEBUG_SCENE";

  constructor(x: number, y: number, width: number, height: number, zoom: number) {
    super({
      key: "DEBUG_SCENE",
      cameras: {
        name: "DEBUG_CAM",
        x: x,
        y: y,
        width: width,
        height: height,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: "",
        rotation: 0,
        roundPixels: true,
        zoom: zoom,
      },
      active: true,
      visible: true,
    });
  }

  init() {}

  preload() {}

  create() {
    this.textObj = this.add.text(0, 0, "DEBUG", { color: "#00ff00", font: "16px Courier" });
    this.inputkey = this.input.keyboard.addKey("J", true, false);

    this.gameGraph = this.add.graphics({
      x: 0,
      y: 0,
      fillStyle: { color: Phaser.Display.Color.GetColor(255, 0, 0), alpha: 0.5 },
      lineStyle: { color: Phaser.Display.Color.GetColor(255, 0, 0), alpha: 0.5, width: 1 },
    });
    this.targetScene = this;
  }

  update(): void {
    this.Print();
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
      GameManager.GmObj.Move.Move(this.targetScene, scene, this.gameGraph);
      this.gameGraph.setVisible(true);
      this.gameGraph.setActive(true);

      this.targetScene = scene;
    } else console.error("DEBUG obj bad initililization or not done", this.targetScene);
  }
}
