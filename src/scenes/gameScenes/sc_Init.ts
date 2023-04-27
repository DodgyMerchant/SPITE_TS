import { SPITEManager as GM } from "../../main";
import { gameManager } from "../../main";
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

    // enter debugging scene into system
    gameManager.Game.scene.add(this.DEBUG.key, this.DEBUG);
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    this.scene.start(GM.Scene.UniqueAdd(this.scene, sc_MainMenu) ?? undefined);
  }

  update(): void {
    // console.log("sc_Init update");

    this.DEBUG.AddText(["TEST"]);
  }
}
