import { gameManager } from "../main";
import sc_MainMenu from "./sc_MainMenu";
import { sc_MyScene } from "./sc_MyScene";

export default class sc_Init extends sc_MyScene {

  constructor() {
    super({
      key: "sc_Init"
    });
  }

  init() {
    super.init();
  }

  preload() {
    super.preload();
    // this.load.image("mapImg", "assets/mapImg.png");
  }

  create() {
    super.create();
    // const { width, height } = this.scale;
    // this.add.image(width * 0.5, height * 0.5, "mapImg");

    this.scene.start(gameManager.SceneAdd("sc_MainMenu", sc_MainMenu));
  }

  update(): void {
    console.log("sc_Init update");
  }
}
