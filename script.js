//SKETCH 8
//COMPLETED BY: Jason Cao
///DATE: 11/16/26

nn.on("load", () => {

  // KAPLAY SETUP

  kaplay({

    // button setup

    buttons: {
      moveUp: {
        keyboard: ["up", "w"],
        gamepad: ["dpad-up"],
      },
      moveDown: {
        keyboard: ["down", "s"],
        gamepad: ["dpad-down"],
      },
      moveLeft: {
        keyboard: ["left", "a"],
        gamepad: ["dpad-left"],
      },
      moveRight: {
        keyboard: ["right", "d"],
        gamepad: ["dpad-right"],
      },
    },

    // background color
    background: [211, 211, 211]
    // background settings

  });



  // GLOBAL VARIABLES


  const SPEED = 120;
  const JUMP_FORCE = 500;
  const DEADZONE = 0.15;

  let soundEffect;
  let isPlaying = false;
  let bgm;

  let timeLeft = 30;
  let gameScore = 0;

  let spawnSide = "left";




  // SPRITES

  // player sprite

  loadSprite(
    "kat", "assets/person.png",

    // sprite file

    { //sprite animation
      sliceX: 4,
      sliceY: 4,
      anims: {
        //forward and back don't need to be in quotes
        forward: {
          from: 0,
          to: 3,
          speed: 5,
          loop: true,
        },
        back: {
          from: 4,
          to: 7,
          speed: 10,
          loop: true,
        },
        left: {
          from: 8,
          to: 11,
          speed: 10,
          loop: true,
        },
        right: {
          from: 12,
          to: 15,
          speed: 10,
          loop: true,
        }
      }

      // sprite animation

    }
  );

  // idle sprite


  // enemy sprite

  loadSprite("enemy", "assets/enemy.png", {
  sliceX: 4,
  sliceY: 2,
  anims: {
    idle: {
      from: 0,
      to: 1,
      speed: 5,
      loop: true,
    }
  }
});

  // collectible sprite

  loadSprite("Chest", "assets/Chest.png", {
  sliceX: 5,
  sliceY: 2,
  anims: {
    idle: {
      from: 0,
      to: 9,
      speed: 5,
      loop: true,
    }
  }
});



  // AUDIO ASSETS

  loadSound(
    "sound", "assets/emperor_sound.mp3"

    // sound file
  );

  loadSound(
    "dead", "assets/dead_2.mp3"

    // sound file
  );

  loadMusic(
    "bgu", "assets/intersteller.mp3"

    // music file
  );



  // HELPERS

  function playSoundEffect () {

    // sound logic
    if (!isPlaying) {
      isPlaying = true;

    soundEffect = play("sound", {
      volume: 0.5,
    });
    soundEffect.onEnd(() => {
      isPlaying = false;
    })

  }
  }



  function makePlatform (x, y, w, colorValue) {

    add([
      rect(w, 40),
      area(),
      outline(6),
      pos(x, y),
      body({
        isStatic: true
      }),
      color(colorValue),
      "platform"



      // platform setup

    ]);

  }



  function spawnCollectible () {

    add([
      sprite("Chest"),
      pos(rand(0, width()), rand(0, height())),
      scale(2),
      rotate(rand(0, 65)),
      area(),
      anchor("center"),
      "Chest"

      // collectible setup

    ]);

  }



  function spawnEnemy () {

    const enemy = add([

      // enemy setup
      sprite("enemy"),
      scale(2),
      pos(rand(100, width() - 100), rand(100, height() - 100)),
      area(),
      anchor("center"),
      "enemy"

    ]);
    wait(rand(3, 30), () => {
      if (enemy.exists()) {
        destroy(enemy);
      }
    })

    // enemy timer

  }



  function spawnEnemyWave () {
    const amount = randi(2, 5)

    // wave logic
    for (let i = 0; i < amount; i++) {
      spawnEnemy();
    }
  }



  // LVL 1 SCENE

  scene("level1", () => {

    setGravity(640);
onLoad(() => {

  // music start
  bgm = play("bgu", {
    loop: true,
    volume: 0.5,
  })

});



onKeyPress("space", () => {

  // music toggle
  bgm.paused = !bgm.paused;

});

    let facing = RIGHT;

    const scoreText = add([
      text(gameScore.toString(), {
        size: 24,
      }),

      pos(24, 24),
      color(BLACK),
      // score display

    ]);

    const timer = add([
      text(timeLeft.toFixed(0)),
      pos(width() - 24, 24),
      anchor("topright"),
      color(BLACK)
      // timer display

    ]);



    const player = add([
      sprite("kat"),
      pos(center()),
      anchor("center"),
      area(),
      scale(2),
      body({
        jumpForce: JUMP_FORCE,
      }),
      doubleJump(),

      // player setup

    ]);
    player.play("forward");



    // LEVEL EXIT

    const levelExit = add([
      rect(10, height()),
      pos(width() - 10, 0),
      area(),
      color(GREEN),
      "levelExit"

      // exit setup

    ]);



    // PLATFORMS

    makePlatform(
      0, height() - 24, width(), MAGENTA
      // floor platform

    );



    for (let i = 0; i < 5; i++) {

      // random platforms
      makePlatform(rand(0, width() - 250), height() - 150 - (i * 100),
        rand(50, 230),
        rgb(rand(0, 255), 0, rand(0, 255)));

    }



    // COLLECTIBLES

    for (let i = 0; i < 5; i++) {

      spawnCollectible();

    }
    loop(5, spawnCollectible);

    // collectible loop



    // ENEMIES

    spawnEnemyWave();
    loop(15, spawnEnemyWave);

    // enemy loop




    // CONTROLS

    onButtonDown("moveRight", () => {

      // move right
      player.move(SPEED, 0);
      facing = RIGHT;
      playSoundEffect();
      player.play("right");

    });



    onButtonDown("moveLeft", () => {

      // move left
      player.move(-SPEED, 0);
      facing = LEFT;
      playSoundEffect();
      player.play("left");

    });



    onButtonDown("moveUp", () => {

      // jump logic
      player.doubleJump();
      player.play("forward")

    });



    onButtonDown("moveDown", () => {

      // move down
      player.move(0, -SPEED);
      player.play("back")

    });



    // PROJECTILES

    function shoot () {

      add([
        circle(4),
        color(BLUE),
        pos(player.pos),
        anchor("center"),
        area(),
        move(facing, 500),
        offscreen({
          destroy: true
        }),
        "bullet",

        // projectile setup

      ]);

    }
    onGamepadButtonPress("south", shoot);
    onKeyPress("f", shoot);
    // shoot controls



    // CAMERA

    // camera follow



    // TIMER & JOYSTICK (ANALOG) MOVEMENT

    onUpdate(() => {

      // movement logic
      const moveDir = getGamepadStick("left");
      if (moveDir.len() > DEADZONE) {
        player.move(moveDir.scale(SPEED));
      }

      // timer logic
      timeLeft -= dt();
      timer.text = timeLeft.toFixed(1);

      // win check
      if (timeLeft <= 0) {
        go("win");
      }

      // lose check

    });



    // COLLISIONS

    player.onCollide("Chest", (item) => {

      // collect logic
      destroy(item);
      play("sound");
      gameScore++;
      scoreText.text = gameScore.toString();
    });



    player.onCollide("enemy", () => {

      // lose logic
      go("lose")

    });



    onCollide("bullet", "enemy", (bullet, enemy) => {

      // projectile collision
      destroy(bullet);
      destroy(enemy);
      gameScore += 5;
      scoreText.text = gameScore.toString();

    });



    // TRANSITION EFFECT

    const fade = add([
      rect(width(), height()),
      pos(0, 0),
      color(BLACK),
      opacity(0),
      fixed(),

      // fade overlay

    ]);



    player.onCollide("levelExit", () => {

      // level transition
      tween(
        0,
        1,
        0.5,
        (value) => {
          fade.opacity = value;
        },
        easings.linear);
      wait(0.5, () => {
        spawnSide = "left";
        go("level2")
      });


    });

  });



  // LVL 2 SCENE

  scene("level2", () => {
    console.log("LEVEL2");

    setGravity(640);
onLoad(() => {

  // music start
  bgm = play("bgu", {
    loop: true,
    volume: 0.5,
  })

});



onKeyPress("space", () => {

  // music toggle
  bgm.paused = !bgm.paused;

});

    let facing = RIGHT;





    const scoreText = add([
      text(gameScore.toString(), {
        size: 24,
      }),
      pos(24, 24),
      color(BLACK),
      fixed(),

      // score display

    ]);



    const timer = add([
      text(timeLeft.toFixed(1)),
      pos(width() - 24, 24),
      anchor("topright"),
      color(BLACK),
      fixed(),

      // timer display

    ]);



    const player = add([
      sprite('kat'),
      pos(spawnSide === "left" ? 150 : width() - 150,
        height() / 2),
      anchor("center"),
      area(),
      body({
        jumpForce: JUMP_FORCE,
      }),
      doubleJump(),

      // player setup

    ]);
    player.play("forward");



    const returnExit = add([
      rect(10, height()),
      pos(0, 0),
      area(),
      color(MAGENTA),
      "returnExit",

      // return exit

    ]);



    // PLATFORMS

    makePlatform(
      0,
      height() - 24,
      width(),
      GREEN


      // floor platform

    );
    for (let i = 0; i < 5; i++) {

      // random platforms
      makePlatform(rand(0, width() - 250), height() - 150 - (i * 100),
        rand(50, 230),
        rgb(rand(0, 255), 0, rand(0, 255))
      );
    }


    // random platforms



    // ENEMIES

    spawnEnemyWave();
    loop(20, () => {
      spawnEnemyWave();
    })



    // enemy loop



    // COLLECTIBLES

    for (let i = 0; i < 5; i++) {

      spawnCollectible();

    }
    loop(5, spawnCollectible);



    // collectible loop



    // CONTROLS
    onButtonDown("moveRight", () => {

      // move right
      player.move(SPEED, 0);
      facing = RIGHT;
      playSoundEffect();
      player.play("right");

    });



    onButtonDown("moveLeft", () => {

      // move left
      player.move(-SPEED, 0);
      facing = LEFT;
      playSoundEffect();
      player.play("left");

    });



    onButtonDown("moveUp", () => {

      // jump logic
      player.doubleJump();
      player.play("forward")

    });



    onButtonDown("moveDown", () => {

      // move down
      player.move(0, -SPEED);
      player.play("back")

    });

    // movement controls



    // PROJECTILES

    function shoot () {

      add([
        circle(4),
        color(BLUE),
        pos(player.pos),
        anchor("center"),
        area(),
        move(facing, 500),
        offscreen({
          destroy: true
        }),
        "bullet",

        // projectile setup

      ]);

    }
    onGamepadButtonPress("south", shoot);
    onKeyPress("f", shoot);

    // projectile setup





  // COLLISIONS

  player.onCollide("Chest", (item) => {

    // collect logic
    destroy(item);
    play("sound");
    gameScore++;
    scoreText.text = gameScore.toString();
  });



  player.onCollide("enemy", () => {

    // lose logic
    go("lose")

  });



  onCollide("bullet", "enemy", (bullet, enemy) => {

    // projectile collision
    destroy(bullet);
    destroy(enemy);
    gameScore += 5;
    scoreText.text = gameScore.toString();

  });



  // CAMERA
  // camera scale
  setCamScale(1.5);

  // camera follow
  player.onUpdate(() => {
    setCamPos(player.pos);
  })



  // TIMER + ANALOG MOVEMENT

 onUpdate(() => {

      // movement logic
      const moveDir = getGamepadStick("left");
      if (moveDir.len() > DEADZONE) {
        player.move(moveDir.scale(SPEED));
      }

      // timer logic
      timeLeft -= dt();
      timer.text = timeLeft.toFixed(1);

      // win check
      if (timeLeft <= 0) {
        go("win");
      }

      // lose check

    });



  player.onCollide("returnExit", () => {

    // return transition
spawnSide = "right";
    go("level1");

      // return exit

});

});



// WIN GAME SCENE

scene("win", (finalScore) => {

  add([
    text(`You WIN!\nScore: ${gameScore}`, {
      size: 32,
    }),
    pos(center()),
    anchor("center"),
    color(BLACK)

    // win text

  ]);



  add([
    text("Press ENTER to play again"),
    pos(center().add(0, 120)),
    anchor("center"),
    color(BLACK),
  ]);
      onKeyPress("enter", () => {
      gameScore = 0;
      timeLeft = 30;
      go("level1");
 });



});



//LOSE GAME SCENE

scene("lose", () => {

  add([
    text("YOU LOSE", {
      size: 48,
    }),
    pos(center()),
    anchor("center"),
    color(BLACK),
  ]);

  // lose text




    onKeyPress("enter", () => {
      gameScore = 0;
      timeLeft = 30;
      go("level1");

      // restart text
    });
});




// START MUSIC ONCE LOADED
/**
onLoad(() => {

  // music start
  bgm = play("bgu", {
    loop: true,
    volume: 0.5,
  })

});



onKeyPress("space", () => {

  // music toggle
  bgm.paused = !bgm.paused;

});
 **/


// RESET GAME 

go("level1");

});


/** 
onClick("player", (p) => {
  p.use(sprite("kat"));
  play("sound");
  score += 10;
})

player.onCollide("player", (p) => {
  const playerPos = p.pos;
  destroy(p);
  add({
    sprite(),
    pos(playerPos),
    anchor("center")
  }) **/