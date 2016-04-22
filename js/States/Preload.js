class preload extends Phaser.State {
  constructor(game) {
    super();
  }
  preload() {
    var loadingBar = this.add.sprite(this.game.width/2, this.game.height/2, "loading");
    loadingBar.anchor.setTo(0.5);
    this.game.load.setPreloadSprite(loadingBar);
    this.game.load.image("title", "assets/sprites/title.png");
    this.game.load.image("playButton", "assets/sprites/playButton.png");
    this.game.load.image("backsplash", "assets/sprites/backsplash.png");
    this.game.load.image("wall", "assets/sprites/wall.png");
    this.game.load.image("tunnelbg", "assets/sprites/tunnelbg.png");
    this.game.load.image("ship", "assets/sprites/ship.png");
    this.game.load.image("smoke", "assets/sprites/smoke.png");
    this.game.load.image("barrier", "assets/sprites/barrier.png");
  }

  create() {
    console.log("preload started");
    this.game.state.start("TitleScreen");
  }
}

export default preload;
