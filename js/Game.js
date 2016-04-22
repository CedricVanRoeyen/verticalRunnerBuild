import boot from "./States/Boot";
import preload from "./States/preload";
import titleScreen from "./States/titleScreen";
import playGame from "./States/playGame";
import gameOverScreen from "./States/gameOverScreen";

class Game extends Phaser.Game {
  constructor(width, height, renderer, div) {
    super(width, height, renderer, div);
    this.state.add("Boot", boot);
    this.state.add("Preload", preload);
    this.state.add("TitleScreen", titleScreen);
    this.state.add("PlayGame", playGame);
    this.state.add("GameOverScreen", gameOverScreen);
    this.state.start("Boot");
  }
}

export default Game;
