import Phaser from "phaser";
import sc_Main from "./scenes/sc_Main";

/*
tried fixing render context willReadFrequently warning.
if more warnings pop up this might fix it.
*/
// let myCanvas = document.createElement("canvas");
// let myCont =
//   myCanvas.getContext("2d", { willReadFrequently: true }) ?? undefined;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // type: Phaser.CANVAS,
  parent: "phaser-div",
  // canvas: myCanvas,
  // context: myCont,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: false,
  },
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [sc_Main],
};

const Game: Phaser.Game = new Phaser.Game(config);
console.log("Used renderer: ", Game.renderer.constructor.name);
