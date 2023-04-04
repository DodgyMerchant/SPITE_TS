/**
 * Debug Scene.
 * handles debug scene for displaying.
 */
export class DebugScene extends Phaser.Scene {
  textObj: Phaser.GameObjects.Text | undefined;
  displayText = new Array<string>();
  inputkey: Phaser.Input.Keyboard.Key | undefined;
  graph: Phaser.GameObjects.Graphics | undefined;
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
    this.graph = this.add.graphics({
      x: 0,
      y: 0,
      fillStyle: { color: Phaser.Display.Color.GetColor32(255, 0, 0, 255) },
      lineStyle: { color: Phaser.Display.Color.GetColor32(255, 0, 0, 255), width: 1 },
    });
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
}
