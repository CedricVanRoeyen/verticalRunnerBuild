import GlobalVars from "../objects/GlobalVars";
import Barrier from "../objects/Barrier";


class playGame extends Phaser.State {
  constructor(game) {
    super(game);
  }

  create() {
    console.log("game starts running");
    //setting general color (color is configured in preload state)
    this.tintColor = GlobalVars.currentColor;
    //tunnel
    this.createTunnel();
    //ship
    this.createShip();
    //smoke particle effect
    this.createSmoke();
    //barriers
    this.barrierGroup = this.add.group();
    this.addBarrier(this.game, this.barrierGroup, this.tintColor);
  }
  update() {
    this.checkCollision();
    this.updateSmoke();
    this.checkForSwipe();
  }

  createTunnel() {
    //tunner background
    var tunnelBG = this.add.tileSprite(0,0, this.game.width, this.game.height, "tunnelbg");
    tunnelBG.tint = GlobalVars.currentColor;
    //walls
    //left
    var leftWallBG = this.add.tileSprite(-GlobalVars.tunnelWidth/2, 0, this.game.width/2, this.game.height, "wall");
    leftWallBG.tint = this.tintColor;
    //right
    var rightWallBG = this.add.tileSprite((this.game.width + GlobalVars.tunnelWidth)/2, 0, this.game.width, this.game.height, "wall");
    rightWallBG.tint = this.tintColor;
    rightWallBG.tileScale.x = -1;
  }

  createShip() {
    //creating the player
    //the 2 positions the player can be at
    this.shipPositions = [(this.game.width - GlobalVars.tunnelWidth) / 2 + 32, (this.game.width + GlobalVars.tunnelWidth)/2 - 32];
    this.ship = this.add.sprite(this.shipPositions[0], 860, "ship");
    //current side on which the spaceship can be on
    this.ship.currentSide = 0;
    //is ship distroyed
    this.ship.destroyed = false;
    //input allowed ?
    this.ship.canMove = true;
    this.ship.canSwipe = false;

    this.ship.anchor.setTo(0.5);
    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    // input/controlling the ship
    this.input.onDown.add(this.moveShip, this);
    this.input.onUp.add(function() {
      this.ship.canSwipe = false;
    }, this);

    //make ship move constanly upwards
    this.verticalTween = this.add.tween(this.ship).to({y: 0}, GlobalVars.shipVerticalSpeed, Phaser.Easing.Linear.None, true);
  }
  moveShip() {
    this.ship.canSwipe = true;
    if(this.ship.canMove) {
      this.ship.canMove = false;
      this.ship.currentSide = 1 - this.ship.currentSide;
      var moveShipTween = this.add.tween(this.ship).to(
        {x: this.shipPositions[this.ship.currentSide]},
        GlobalVars.shipHorizontalSpeed, Phaser.Easing.Linear.None, true
      );
      moveShipTween.onComplete.add(function() {
        this.ship.canMove = true;
      }, this);
      //creating the ghost effect
      var ghostShip = this.add.sprite(this.ship.x, this.ship.y, "ship");
      ghostShip.alpha = 0.5;
      ghostShip.anchor.setTo(0.5);
      //the tween for the ghostShip
      var ghostShipTween = this.add.tween(ghostShip).to({alpha: 0},
        350, Phaser.Easing.Linear.None, true);
      ghostShipTween.onComplete.add(function() {
        ghostShip.destroy();
      });
    }
  }

  checkForSwipe() {
    if (this.ship.canSwipe) {
      if (Phaser.Point.distance(this.input.activePointer.positionDown, this.input.activePointer) > GlobalVars.minSwipeDistance) {
        this.restartShip();
      }
    }
  }
  restartShip() {
    if (!this.ship.destroyed && this.ship.alpha == 1) {
      this.ship.canSwipe = false;
      this.verticalTween.stop(true);
      this.ship.alpha = 0.5;
      this.verticalTween = this.add.tween(this.ship).to({y: 860},   100, Phaser.Easing.Linear.None, true);
      this.verticalTween.onComplete.add(function() {
        this.verticalTween = this.add.tween(this.ship).to({y: 0},   GlobalVars.shipVerticalSpeed, Phaser.Easing.Linear.None,  true);
        var alphaTween = this.add.tween(this.ship).to({
          alpha: 1}, GlobalVars.shipInvulnerbilityTime,   Phaser.Easing.Bounce.In, true);
        }, this);
      }
  }

  createSmoke() {
    this.smokeEmitter = this.add.emitter(this.ship.x, this.ship.y + 10, 20);
    this.smokeEmitter.makeParticles("smoke");
    this.smokeEmitter.setXSpeed(-15, 15);
    this.smokeEmitter.setYSpeed(50, 150);
    this.smokeEmitter.setAlpha(0.5, 1);
    this.smokeEmitter.start(false, 1000, 40);
  }
  updateSmoke() {
    this.smokeEmitter.x = this.ship.x;
    this.smokeEmitter.y = this.ship.y + 10;
  }

  addBarrier(game, group, tintColor) {
    var barrier = new Barrier(game, GlobalVars.barrierSpeed, tintColor);
    game.add.existing(barrier);
    group.add(barrier);
  }

  checkCollision() {
    if(!this.ship.destroyed && this.ship.alpha == 1) {
      this.physics.arcade.collide(this.ship, this.barrierGroup, null, function(s, b){this.destroyShip()}, this);
    }
  }
  destroyShip() {
      this.ship.canMove = false;
      this.ship.canSwipe = false;
      this.ship.destroyed = true;
      //delete the smoke emitter
      this.smokeEmitter.destroy();
      var destroyTween = this.add.tween(this.ship).to({
        x: this.ship.x + this.game.rnd.between(-100, 100),
        y: this.ship.y - 100, rotation: 10},
        1000,
        Phaser.Easing.Linear.None,
        true);
      destroyTween.onComplete.add(function() {
        var explosionEmitter = this.game.add.emitter(this.ship.x, this.ship.y, 200);
        explosionEmitter.makeParticles("smoke");
        explosionEmitter.setAlpha(0.5, 1);
        explosionEmitter.minParticleScale = 0.5;
        explosionEmitter.maxParticleScale = 2;
        explosionEmitter.start(true, 2000, null, 200);
        this.ship.destroy();
        this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
          this.state.start("GameOverScreen");
        }, this);
      }, this);
    }
}
export default playGame;
