import GlobalVars from "../objects/GlobalVars";

class titleScreen extends Phaser.State {
  constructor(game) {
    super();
  }
  create() {
    //getting random color for bg
    GlobalVars.currentColor = GlobalVars.bgColors[this.game.rnd.between(0, GlobalVars.bgColors.length-1)];
    console.log("TitleScreen started");
    //background pattern
    var titleBG = this.add.tileSprite(0, 0 ,this.game.width, this.game.height, "backsplash");
    titleBG.tint = GlobalVars.currentColor;
    //setting a random backround color
    this.game.stage.backgroundColor = GlobalVars.currentColor;

    //title sprite
    var title = this.add.sprite(this.game.width/2, 240, "title");
    title.anchor.setTo(0.5);
    //play button
    var playButton = this.add.button(this.game.width/2, this.game.height -200, "playButton", this.startGame);
    playButton.anchor.setTo(0.5);
    //tweening the play button (breathing)
    var playButtonTween = this.add.tween(playButton).to({width: 220, height: 220}, 1500, "Linear", true, 0, -1, true);

    // this.game.state.start("PlayGame");
  }

  startGame() {
    this.game.state.start("PlayGame");
  }
}

export default titleScreen;
