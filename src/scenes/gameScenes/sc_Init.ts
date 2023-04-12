import { MyGameManager as MGM, gameManager } from "../../main";
import sc_MainMenu from "./sc_MainMenu";
import { sc_MyScene } from "../abstract/sc_MyScene";

export default class sc_Init extends sc_MyScene {
  constructor() {
    super(
      {
        key: "sc_Init",
      },
      gameManager
    );
  }

  init() {
    super.init();

    gameManager.Game.scene.add("DEBUG", this.DEBUG);
  }

  preload() {
    super.preload();

    this.load.setPath("src/assets/");
    // this.load.image("mapImg", "assets/mapImg.png");

    this.load.image("img_player_idle_stand", "player/idle/img_player_idle_stand.png");

    MGM.Load.strip(
      this,
      {
        key: "sheet_player_idle_idle",
        url: "player/idle/spr_player_idle_idle.png",
        frameConfig: { frameWidth: 16, frameHeight: 22 },
      },
      {
        key: "an_player_idle_idle",
        frameRate: 1,
        repeat: -1,
        yoyo: true,
      }
    );
  }

  create() {
    super.create();
    // const { width, height } = this.scale;
    // this.add.image(width * 0.5, height * 0.5, "mapImg");

    this.scene.start(MGM.Scene.UniqueAdd(this.scene, sc_MainMenu));
  }

  update(): void {
    console.log("sc_Init update");
  }
}
