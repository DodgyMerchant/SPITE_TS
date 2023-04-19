import { SPITEManager as GM } from "../../main";
import { GameManager } from "../../myUtils/gameManager";

/**
 * HUD type scene.
 *
 * Transparent overlay.
 */
export default abstract class sc_Hud extends Phaser.Scene {
  /**
   * scene key
   */
  // key: string = "DEBUG_SCENE";

  constructor(camKey: string, camName: string, x: number, y: number, width: number, height: number, zoom: number) {
    super({
      key: camKey,
      cameras: {
        name: camName,
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

  create() {}

  update(): void {
    if (!GameManager.Scene.Order.isTop(this)) {
      console.log("bring me to top");
      this.scene.bringToTop(this);
    }
  }
}
