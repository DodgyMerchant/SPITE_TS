import { gameManager } from "../main";
import sc_Game from "./sc_Game";
import { sc_MyScene } from "./sc_MyScene";

export default class sc_MainMenu extends sc_MyScene {
  constructor() {
    super({});
  }

  init() {
    super.init();
  }

  preload() {
    super.preload();
  }

  create() {
    super.create();

    this.scene.start(gameManager.SceneAdd("sc_Game", sc_Game));
  }

  update(time: number, delta: number): void {
    console.log("sc_MainMenu update");
  }
}
