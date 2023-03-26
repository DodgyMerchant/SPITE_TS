export default class sc_Main extends Phaser.Scene {
  constructor() {
    super({
      key: "sck_main",
    });
  }

  init() {}

  preload() {
    this.load.image("mapImg", "assets/mapImg.png");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width * 0.5, height * 0.5, "mapImg");
  }

  update(time: number, delta: number): void {
    // console.log("update");
  }
}
