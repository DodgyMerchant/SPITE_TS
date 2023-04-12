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
