import { gameManager } from "../../main";
import { SPITEManager as GM } from "../../main";
import sc_Game from "./sc_Game";
import { sc_MyScene } from "../abstract/sc_MyScene";

export default class sc_MainMenu extends sc_MyScene {
  constructor() {
    super({}, gameManager);
  }

  init() {
    super.init();
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    this.scene.start(GM.Scene.UniqueAdd(this.scene, sc_Game) ?? undefined);
  }

  update(time: number, delta: number): void {
    console.log("sc_MainMenu update");
  }
}
