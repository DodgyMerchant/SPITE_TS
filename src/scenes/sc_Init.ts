import { gameManager } from "../main";
import sc_MainMenu from "./sc_MainMenu";
import { sc_MyScene } from "./sc_MyScene";

export default class sc_Init extends sc_MyScene {
  constructor() {
    super({
      key: "sc_Init",
    });
  }

  init() {
    super.init();
  }

  preload() {
    super.preload();

    this.load.setPath("src/assets/");
    // this.load.image("mapImg", "assets/mapImg.png");

    this.load.image("img_player_idle_stand", "player/idle/img_player_idle_stand.png");

    gameManager.loadStrip(
      this,
      {
        key: "sheet_player_idle_idle",
        url: "player/idle/spr_player_idle_idle.png",
        frameConfig: { frameWidth: 16 },
      },
      {
        key: "an_player_idle_idle",
        // frames: "sheet_player_idle_idle",
        frameRate: 8,
        repeat: -1,
      },
      { frames: [0, 1, 2] }
    );
  }

  create() {
    super.create();
    // const { width, height } = this.scale;
    // this.add.image(width * 0.5, height * 0.5, "mapImg");

    this.scene.start(gameManager.SceneUniqueAdd(sc_MainMenu));
  }

  update(): void {
    console.log("sc_Init update");
  }
}
